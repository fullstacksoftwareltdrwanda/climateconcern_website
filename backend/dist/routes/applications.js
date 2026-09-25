"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const mailer_1 = require("../lib/mailer");
const requireAuth_1 = require("../middleware/requireAuth");
const requirePermission_1 = require("../middleware/requirePermission");
const router = (0, express_1.Router)();
// ─── File upload setup for Proof of Payment ─────────────────
const uploadDir = path_1.default.join(__dirname, '../../uploads/payments');
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext))
            cb(null, true);
        else
            cb(new Error('Only PDF, PNG, JPG, and WEBP files are allowed for payment proof'));
    },
});
const createSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    course: zod_1.z.string().min(1),
    amountPaid: zod_1.z.string().optional(),
    termsAccepted: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string().transform((v) => v === 'true')]).optional(),
});
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['APPROVED', 'REJECTED']),
});
// POST /api/applications — public (multipart/form-data or json)
router.post('/', upload.single('paymentProof'), async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        if (req.file)
            fs_1.default.unlink(req.file.path, () => { });
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const paymentProofPath = req.file ? req.file.path : null;
    const paymentProofName = req.file ? req.file.originalname : null;
    const application = await prisma_1.default.application.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            course: parsed.data.course,
            amountPaid: parsed.data.amountPaid || '$500 USD / ~675,000 RWF',
            termsAccepted: parsed.data.termsAccepted ?? true,
            paymentProofPath,
            paymentProofName,
        },
    });
    // Confirmation email to applicant
    await (0, mailer_1.sendMail)(application.email, 'Your Course Application & Payment Received — Climate Concern', `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#00652c;">Application & Proof of Payment Received</h2>
        <p>Dear <strong>${application.name}</strong>,</p>
        <p>Thank you for applying to the <strong>${application.course}</strong> at Climate Concern Rwanda.</p>
        <div style="background:#f4fbf7;border:1px solid #ccebd7;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0 0 8px;font-weight:bold;color:#00652c;">Program Structure & Certification:</p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#333;">
            <li><strong>Phase 1 (Included):</strong> Self-paced online learning portal (awards official Certificate of Completion)</li>
            <li><strong>Phase 2 (Optional & Paid):</strong> Interactive expert support, live mentoring & project reviews (if you choose to participate)</li>
            <li><strong>Self-Paced Tuition:</strong> $500 USD (~675,000 RWF)</li>
          </ul>
        </div>
        <p>We have received your enrollment and payment documentation. Our training coordinators will verify your payment and review your application shortly. 
           You will receive a confirmation email with your access credentials and program schedule within 2 business days.</p>
        <hr style="border:1px solid #eee;margin:24px 0;" />
        <p style="font-size:12px;color:#666;">Climate Concern Rwanda · Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda</p>
      </div>
    `).catch(console.error);
    // Notification email to all admins with applications.view permission
    const admins = await prisma_1.default.admin.findMany({ where: { isActive: true } });
    const adminEmails = admins
        .filter((a) => {
        const perms = a.permissions;
        return a.isMainAdmin || perms?.applications?.view;
    })
        .map((a) => a.email);
    if (adminEmails.length > 0) {
        await (0, mailer_1.sendMail)(adminEmails.join(','), `New Training Application ($500 Paid) — ${application.name}`, `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#00652c;">New Training Application Received</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${application.name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${application.email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${application.phone ?? 'Not provided'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Course</td><td style="padding:8px;border-bottom:1px solid #eee;">${application.course}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Fee Amount</td><td style="padding:8px;border-bottom:1px solid #eee;">${application.amountPaid}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Proof of Payment</td><td style="padding:8px;">${paymentProofName ? `Attached (${paymentProofName})` : 'None uploaded'}</td></tr>
          </table>
          <p style="margin-top:16px;"><a href="${process.env.FRONTEND_URL}/admin/applications" style="color:#00652c;">Review in Admin Panel →</a></p>
        </div>
      `).catch(console.error);
    }
    res.status(201).json({ success: true, id: application.id });
});
// GET /api/applications — admin only
router.get('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('applications', 'view'), async (req, res) => {
    const { status } = req.query;
    const where = status ? { status: status } : {};
    const applications = await prisma_1.default.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
});
// GET /api/applications/:id — admin only
router.get('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('applications', 'view'), async (req, res) => {
    const app = await prisma_1.default.application.findUnique({ where: { id: req.params.id } });
    if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
    }
    res.json(app);
});
// GET /api/applications/:id/payment-proof — admin only
router.get('/:id/payment-proof', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('applications', 'view'), async (req, res) => {
    const app = await prisma_1.default.application.findUnique({ where: { id: req.params.id } });
    if (!app || !app.paymentProofPath) {
        res.status(404).json({ error: 'Payment proof file not found' });
        return;
    }
    let filePath = path_1.default.resolve(app.paymentProofPath);
    if (!fs_1.default.existsSync(filePath)) {
        // Fallback: search in uploadDir by basename
        const fallback = path_1.default.join(uploadDir, path_1.default.basename(app.paymentProofPath));
        if (fs_1.default.existsSync(fallback)) {
            filePath = fallback;
        }
        else {
            res.status(404).json({ error: 'Payment proof file missing on disk' });
            return;
        }
    }
    const isPreview = req.query.preview === '1' || req.query.view === '1';
    if (isPreview) {
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (ext === '.pdf') {
            res.setHeader('Content-Type', 'application/pdf');
        }
        else if (['.jpg', '.jpeg'].includes(ext)) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
        else if (ext === '.png') {
            res.setHeader('Content-Type', 'image/png');
        }
        else if (ext === '.webp') {
            res.setHeader('Content-Type', 'image/webp');
        }
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(app.paymentProofName || 'payment-proof')}"`);
        res.sendFile(filePath);
    }
    else {
        res.download(filePath, app.paymentProofName || 'payment-proof');
    }
});
// PATCH /api/applications/:id/status — admin only
router.patch('/:id/status', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('applications', 'edit'), async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
        return;
    }
    const app = await prisma_1.default.application.findUnique({ where: { id: req.params.id } });
    if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
    }
    const updated = await prisma_1.default.application.update({
        where: { id: req.params.id },
        data: { status: parsed.data.status },
    });
    if (parsed.data.status === 'APPROVED') {
        await (0, mailer_1.sendMail)(app.email, 'Congratulations! Your Application is Approved — Climate Concern', `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#00652c;">🎉 Application Approved!</h2>
          <p>Dear <strong>${app.name}</strong>,</p>
          <p>We are delighted to confirm that your application for <strong>${app.course}</strong> has been <strong>approved</strong>.</p>
          <p>Our training coordinators will reach out to you shortly with onboarding details, schedule, and payment instructions.</p>
          <p>Welcome to the Climate Concern training community!</p>
          <hr style="border:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#666;">Climate Concern Rwanda · info@climateconcern.rw</p>
        </div>
      `).catch(console.error);
    }
    else {
        await (0, mailer_1.sendMail)(app.email, 'Update on Your Application — Climate Concern', `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#333;">Application Update</h2>
          <p>Dear <strong>${app.name}</strong>,</p>
          <p>Thank you for your interest in the <strong>${app.course}</strong> at Climate Concern Rwanda.</p>
          <p>After careful review, we are unable to approve your application for the current cohort.</p>
          <p>We sincerely encourage you to apply again for our next cohort — spaces open up regularly and your background is valued. You can reapply any time at <a href="${process.env.FRONTEND_URL}/training" style="color:#00652c;">climateconcern.rw/training</a>.</p>
          <p>If you have questions, feel free to reach out to us at <a href="mailto:info@climateconcern.rw" style="color:#00652c;">info@climateconcern.rw</a>.</p>
          <hr style="border:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#666;">Climate Concern Rwanda · info@climateconcern.rw</p>
        </div>
      `).catch(console.error);
    }
    res.json(updated);
});
exports.default = router;
//# sourceMappingURL=applications.js.map