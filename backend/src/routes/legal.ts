import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const legalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

// GET /api/legal/:type — public (type = "terms" | "privacy")
router.get('/:type', async (req: Request, res: Response): Promise<void> => {
  const { type } = req.params;
  if (!['terms', 'privacy'].includes(type)) {
    res.status(400).json({ error: 'Type must be "terms" or "privacy"' });
    return;
  }
  const content = await prisma.legalContent.findUnique({ where: { type } });
  if (!content) { res.status(404).json({ error: 'Legal content not found' }); return; }
  res.json(content);
});

// PUT /api/legal/:type — admin only (upsert)
router.put('/:type', requireAuth, requirePermission('legal', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const { type } = req.params;
  if (!['terms', 'privacy'].includes(type)) {
    res.status(400).json({ error: 'Type must be "terms" or "privacy"' });
    return;
  }
  const parsed = legalSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }

  const content = await prisma.legalContent.upsert({
    where: { type },
    update: parsed.data,
    create: { type, ...parsed.data },
  });
  res.json(content);
});

export default router;
