import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const courseSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  badge: z.string().min(1),
  overview: z.string().optional().default(''),
  modules: z.array(z.string()).optional().default([]),
  phase1Price: z.number().optional().default(50),
  phase2Price: z.number().optional().default(50),
  phase1Title: z.string().optional(),
  phase1Desc: z.string().optional(),
  phase2Title: z.string().optional(),
  phase2Desc: z.string().optional(),
  order: z.number().int().optional(),
});

// GET /api/training — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const courses = await prisma.trainingCourse.findMany({ orderBy: { order: 'asc' } });
  res.json(courses);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const course = await prisma.trainingCourse.findUnique({ where: { id: req.params.id } });
  if (!course) { res.status(404).json({ error: 'Training course not found' }); return; }
  res.json(course);
});

router.post('/', requireAuth, requirePermission('training', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const course = await prisma.trainingCourse.create({ data: { ...parsed.data, modules: parsed.data.modules ?? [] } });
    res.status(201).json(course);
  } catch { res.status(409).json({ error: 'Training course with that ID already exists' }); }
});

router.put('/:id', requireAuth, requirePermission('training', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const course = await prisma.trainingCourse.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(course);
  } catch { res.status(404).json({ error: 'Training course not found' }); }
});

router.delete('/:id', requireAuth, requirePermission('training', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.trainingCourse.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Training course not found' }); }
});

export default router;
