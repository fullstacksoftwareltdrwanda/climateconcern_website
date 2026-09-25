import { Router, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../lib/prisma';
import { sendMail } from '../lib/mailer';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

// ─── File upload setup ───────────────────────────────────────
const uploadDir = path.join(__dirname, '../../uploads/tor');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX, and ZIP files are allowed'));
  },
});

// ─── Validation ──────────────────────────────────────────────
const createSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  title: z.string().min(1),
  country: z.string().min(1),
  position: z.string().min(1),
  education: z.string().min(1),
  experience: z.string().min(1),
  startMonth: z.string().min(1),
  endMonth: z.string().min(1),
  personDays: z.string().min(1),
  paymentMode: z.string().min(1),
  momoPhone: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(['REVIEWED', 'FULFILLED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

// POST /api/consultant-requests — public (multipart/form-data)
router.post('/', upload.single('torFile'), async (req: Request, res: Response): Promise<void> => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const request = await prisma.consultantRequest.create({
    data: {
      ...parsed.data,
      torFilePath: req.file?.path ?? null,
      torFileName: req.file?.originalname ?? null,
    },
  });

  // Confirmation to client
  await sendMail(
    request.clientEmail,
    'Consultant Request Received — Climate Concern',
    `
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
    `
  ).catch(console.error);

  // Notification to admins with consultant_requests.view permission
  const admins = await prisma.admin.findMany({ where: { isActive: true } });
  const adminEmails = admins
    .filter((a) => {
      const perms = a.permissions as Record<string, { view: boolean }>;
      return a.isMainAdmin || perms?.consultant_requests?.view;
    })
    .map((a) => a.email);

  if (adminEmails.length > 0) {
    await sendMail(
      adminEmails.join(','),
      `New Consultant Request — ${request.clientName} (${request.country})`,
      `
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
      `
    ).catch(console.error);
  }

  res.status(201).json({ success: true, id: request.id });
});

// GET /api/consultant-requests — admin only
router.get('/', requireAuth, requirePermission('consultant_requests', 'view'), async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  const where = status ? { status: status as 'PENDING' | 'REVIEWED' | 'FULFILLED' | 'REJECTED' } : {};
  const requests = await prisma.consultantRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
});

// GET /api/consultant-requests/:id — admin only
router.get('/:id', requireAuth, requirePermission('consultant_requests', 'view'), async (req: Request, res: Response): Promise<void> => {
  const cr = await prisma.consultantRequest.findUnique({ where: { id: req.params.id } });
  if (!cr) { res.status(404).json({ error: 'Request not found' }); return; }
  res.json(cr);
});

// PATCH /api/consultant-requests/:id/status — admin only
router.patch('/:id/status', requireAuth, requirePermission('consultant_requests', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid status' }); return; }

  const cr = await prisma.consultantRequest.findUnique({ where: { id: req.params.id } });
  if (!cr) { res.status(404).json({ error: 'Request not found' }); return; }

  const updated = await prisma.consultantRequest.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes },
  });

  res.json(updated);
});

// GET /api/consultant-requests/:id/download — admin only (download ToR file)
router.get('/:id/download', requireAuth, requirePermission('consultant_requests', 'view'), async (req: Request, res: Response): Promise<void> => {
  const cr = await prisma.consultantRequest.findUnique({ where: { id: req.params.id } });
  if (!cr || !cr.torFilePath) { res.status(404).json({ error: 'File not found' }); return; }
  res.download(cr.torFilePath, cr.torFileName ?? 'document');
});

export default router;
