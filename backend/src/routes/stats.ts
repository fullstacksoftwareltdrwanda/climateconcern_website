import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const statSchema = z.object({
  statId: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().min(1),
  tag: z.string().min(1),
  order: z.number().int().optional(),
});

// GET /api/stats — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });
  res.json(stats);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const stat = await prisma.stat.findUnique({ where: { id: req.params.id } });
  if (!stat) { res.status(404).json({ error: 'Stat not found' }); return; }
  res.json(stat);
});

router.post('/', requireAuth, requirePermission('stats', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = statSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const stat = await prisma.stat.create({ data: parsed.data });
    res.status(201).json(stat);
  } catch { res.status(409).json({ error: 'Stat with that ID already exists' }); }
});

router.put('/:id', requireAuth, requirePermission('stats', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = statSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const stat = await prisma.stat.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(stat);
  } catch { res.status(404).json({ error: 'Stat not found' }); }
});

router.delete('/:id', requireAuth, requirePermission('stats', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.stat.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Stat not found' }); }
});

export default router;
