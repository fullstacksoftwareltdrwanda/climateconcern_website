import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const serviceSchema = z.object({
  serviceId: z.string().min(1),
  icon: z.string().min(1),
  tabLabel: z.string().min(1),
  headline: z.string().min(1),
  shortSummary: z.string().min(1),
  deliverables: z.array(z.string()).optional(),
  subAreas: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  cta: z.string().min(1),
  ctaLink: z.string().min(1),
  color: z.string().min(1),
  order: z.number().int().optional(),
});

// GET /api/services — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  res.json(services);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) { res.status(404).json({ error: 'Service not found' }); return; }
  res.json(service);
});

router.post('/', requireAuth, requirePermission('services', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const service = await prisma.service.create({ data: { ...parsed.data, deliverables: parsed.data.deliverables ?? [], subAreas: parsed.data.subAreas ?? [] } });
    res.status(201).json(service);
  } catch { res.status(409).json({ error: 'Service with that ID already exists' }); }
});

router.put('/:id', requireAuth, requirePermission('services', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(service);
  } catch { res.status(404).json({ error: 'Service not found' }); }
});

router.delete('/:id', requireAuth, requirePermission('services', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'Service not found' }); }
});

export default router;
