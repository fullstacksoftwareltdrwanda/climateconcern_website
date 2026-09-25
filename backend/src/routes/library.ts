import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const categorySchema = z.object({
  catId: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().int().optional(),
});

const itemSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().optional(),
  link: z.string().optional(),
  tag: z.string().optional(),
  order: z.number().int().optional(),
});

// GET /api/library — public (all categories with items)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.libraryCategory.findMany({
    include: { items: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });
  res.json(categories);
});

// GET /api/library/categories/:id — public
router.get('/categories/:id', async (req: Request, res: Response): Promise<void> => {
  const cat = await prisma.libraryCategory.findUnique({
    where: { id: req.params.id },
    include: { items: { orderBy: { order: 'asc' } } },
  });
  if (!cat) { res.status(404).json({ error: 'Category not found' }); return; }
  res.json(cat);
});

// POST /api/library/categories — admin only
router.post('/categories', requireAuth, requirePermission('library', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const cat = await prisma.libraryCategory.create({ data: parsed.data, include: { items: true } });
    res.status(201).json(cat);
  } catch { res.status(409).json({ error: 'Category with that ID already exists' }); }
});

// PUT /api/library/categories/:id — admin only
router.put('/categories/:id', requireAuth, requirePermission('library', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const cat = await prisma.libraryCategory.update({ where: { id: req.params.id }, data: parsed.data, include: { items: true } });
    res.json(cat);
  } catch { res.status(404).json({ error: 'Category not found' }); }
});

// DELETE /api/library/categories/:id — admin only (cascades to items)
router.delete('/categories/:id', requireAuth, requirePermission('library', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.libraryCategory.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Category not found' }); }
});

// POST /api/library/items — admin only
router.post('/items', requireAuth, requirePermission('library', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  const item = await prisma.libraryItem.create({ data: parsed.data });
  res.status(201).json(item);
});

// PUT /api/library/items/:id — admin only
router.put('/items/:id', requireAuth, requirePermission('library', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const item = await prisma.libraryItem.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(item);
  } catch { res.status(404).json({ error: 'Item not found' }); }
});

// DELETE /api/library/items/:id — admin only
router.delete('/items/:id', requireAuth, requirePermission('library', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.libraryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Item not found' }); }
});

export default router;
