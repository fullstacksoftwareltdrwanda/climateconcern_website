import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const contactSchema = z.object({
  phone: z.string().min(1),
  phoneClean: z.string().min(1),
  email: z.string().email(),
  physicalAddress: z.string().min(1),
  xHandle: z.string(),
  xUrl: z.string(),
  linkedinHandle: z.string(),
  linkedinUrl: z.string(),
  igHandle: z.string(),
  igUrl: z.string(),
});

// GET /api/contact — public (singleton row)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  let info = await prisma.contactInfo.findUnique({ where: { id: 'singleton' } });
  if (!info) {
    // Return empty default if not seeded yet
    res.json(null);
    return;
  }
  res.json(info);
});

// PUT /api/contact — admin only (upsert)
router.put('/', requireAuth, requirePermission('contact', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }

  const info = await prisma.contactInfo.upsert({
    where: { id: 'singleton' },
    update: parsed.data,
    create: { id: 'singleton', ...parsed.data },
  });
  res.json(info);
});

export default router;
