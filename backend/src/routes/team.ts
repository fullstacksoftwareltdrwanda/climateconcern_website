import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const teamSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  isFounder: z.boolean().optional(),
  initials: z.string().min(1).max(3),
  bio: z.string().optional(),
  image: z.string().optional(),
  education: z.array(z.string()).optional(),
  keyAreas: z.array(z.string()).optional(),
  order: z.number().int().optional(),
});

// GET /api/team — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  res.json(members);
});

// GET /api/team/:id — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const member = await prisma.teamMember.findUnique({ where: { id: req.params.id } });
  if (!member) { res.status(404).json({ error: 'Team member not found' }); return; }
  res.json(member);
});

// POST /api/team — admin only
router.post('/', requireAuth, requirePermission('team', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = teamSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  const member = await prisma.teamMember.create({ data: { ...parsed.data, education: parsed.data.education ?? [], keyAreas: parsed.data.keyAreas ?? [] } });
  res.status(201).json(member);
});

// PUT /api/team/:id — admin only
router.put('/:id', requireAuth, requirePermission('team', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = teamSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const member = await prisma.teamMember.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(member);
  } catch { res.status(404).json({ error: 'Team member not found' }); }
});

// DELETE /api/team/:id — admin only
router.delete('/:id', requireAuth, requirePermission('team', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Team member not found' }); }
});

export default router;
