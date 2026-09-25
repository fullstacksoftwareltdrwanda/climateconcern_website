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
// ─── File upload setup ───────────────────────────────────────
const uploadDir = path_1.default.join(__dirname, '../../uploads/tor');
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
        const allowed = ['.pdf', '.doc', '.docx', '.zip'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext))
            cb(null, true);
        else
            cb(new Error('Only PDF, DOC, DOCX, and ZIP files are allowed'));
    },
});
// ─── Validation ──────────────────────────────────────────────
const createSchema = zod_1.z.object({
    clientName: zod_1.z.string().min(1),
    clientEmail: zod_1.z.string().email(),
    title: zod_1.z.string().min(1),
    country: zod_1.z.string().min(1),
    position: zod_1.z.string().min(1),
    education: zod_1.z.string().min(1),
    experience: zod_1.z.string().min(1),
    startMonth: zod_1.z.string().min(1),
    endMonth: zod_1.z.string().min(1),
    personDays: zod_1.z.string().min(1),
    paymentMode: zod_1.z.string().min(1),
    momoPhone: zod_1.z.string().optional(),
});
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['REVIEWED', 'FULFILLED', 'REJECTED']),
    adminNotes: zod_1.z.string().optional(),
});
// POST /api/consultant-requests — public (multipart/form-data)
router.post('/', upload.single('torFile'), async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const request = await prisma_1.default.consultantRequest.create({
        data: {
            ...parsed.data,
            torFilePath: req.file?.path ?? null,
            torFileName: req.file?.originalname ?? null,
        },
    });
    // Confirmation to client
    await (0, mailer_1.sendMail)(request.clientEmail, 'Consultant Request Received — Climate Concern', `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#00652c;">Request Received</h2>
        <p>Dear <strong>${request.clientName}</strong>,</p>
        <p>Thank you for submitting your consultant request for <strong>${request.position}</strong> in <strong>${request.country}</strong>.</p>
        <p>Our technical coordination desk will review your Terms of Reference and reach out within <strong>24 hours</strong> with a suitable consultant profile.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Project/Tender</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.title}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Country</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.country}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Person-Days</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.personDays}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Payment Mode</td><td style="padding:8px;">${request.paymentMode}</td></tr>
        </table>
        <hr style="border:1px solid #eee;margin:24px 0;" />
        <p style="font-size:12px;color:#666;">Climate Concern Rwanda · info@climateconcern.rw</p>
      </div>
    `).catch(console.error);
    // Notification to admins with consultant_requests.view permission
    const admins = await prisma_1.default.admin.findMany({ where: { isActive: true } });
    const adminEmails = admins
        .filter((a) => {
        const perms = a.permissions;
        return a.isMainAdmin || perms?.consultant_requests?.view;
    })
        .map((a) => a.email);
    if (adminEmails.length > 0) {
        await (0, mailer_1.sendMail)(adminEmails.join(','), `New Consultant Request — ${request.clientName} (${request.country})`, `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#00652c;">New Consultant Request</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Client</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.clientName} (${request.clientEmail})</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Project</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.title}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Position Needed</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.position}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Country</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.country}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Education Req.</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.education}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Experience</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.experience} Years</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Period</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.startMonth} → ${request.endMonth}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Person-Days</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.personDays}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Payment</td><td style="padding:8px;">${request.paymentMode}${request.momoPhone ? ` (${request.momoPhone})` : ''}</td></tr>
          </table>
          ${request.torFileName ? `<p style="margin-top:16px;">📎 ToR File: <strong>${request.torFileName}</strong></p>` : ''}
          <p style="margin-top:16px;"><a href="${process.env.FRONTEND_URL}/admin/consultant-requests" style="color:#00652c;">View in Admin Panel →</a></p>
        </div>
      `).catch(console.error);
    }
    res.status(201).json({ success: true, id: request.id });
});
// GET /api/consultant-requests — admin only
router.get('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('consultant_requests', 'view'), async (req, res) => {
    const { status } = req.query;
    const where = status ? { status: status } : {};
    const requests = await prisma_1.default.consultantRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
});
// GET /api/consultant-requests/:id — admin only
router.get('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('consultant_requests', 'view'), async (req, res) => {
    const cr = await prisma_1.default.consultantRequest.findUnique({ where: { id: req.params.id } });
    if (!cr) {
        res.status(404).json({ error: 'Request not found' });
        return;
    }
    res.json(cr);
});
// PATCH /api/consultant-requests/:id/status — admin only
router.patch('/:id/status', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('consultant_requests', 'edit'), async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid status' });
        return;
    }
    const cr = await prisma_1.default.consultantRequest.findUnique({ where: { id: req.params.id } });
    if (!cr) {
        res.status(404).json({ error: 'Request not found' });
        return;
    }
    const updated = await prisma_1.default.consultantRequest.update({
        where: { id: req.params.id },
        data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes },
    });
    res.json(updated);
});
// GET /api/consultant-requests/:id/download — admin only (download ToR file)
router.get('/:id/download', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('consultant_requests', 'view'), async (req, res) => {
    const cr = await prisma_1.default.consultantRequest.findUnique({ where: { id: req.params.id } });
    if (!cr || !cr.torFilePath) {
        res.status(404).json({ error: 'File not found' });
        return;
    }
    let filePath = path_1.default.resolve(cr.torFilePath);
    if (!fs_1.default.existsSync(filePath)) {
        const fallback = path_1.default.join(uploadDir, path_1.default.basename(cr.torFilePath));
        if (fs_1.default.existsSync(fallback)) {
            filePath = fallback;
        }
        else {
            res.status(404).json({ error: 'File missing on disk' });
            return;
        }
    }
    const isPreview = req.query.preview === '1' || req.query.view === '1';
    if (isPreview) {
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(cr.torFileName || 'document')}"`);
        res.sendFile(filePath);
    }
    else {
        res.download(filePath, cr.torFileName ?? 'document');
    }
});
exports.default = router;
//# sourceMappingURL=consultantRequests.js.map