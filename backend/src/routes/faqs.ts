import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';

const router = Router();

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().optional(),
});

// GET /api/faqs — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  res.json(faqs);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const faq = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
  if (!faq) { res.status(404).json({ error: 'FAQ not found' }); return; }
  res.json(faq);
});

router.post('/', requireAuth, requirePermission('faqs', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = faqSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  const faq = await prisma.fAQ.create({ data: parsed.data });
  res.status(201).json(faq);
});

router.put('/:id', requireAuth, requirePermission('faqs', 'edit'), async (req: Request, res: Response): Promise<void> => {
  const parsed = faqSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() }); return; }
  try {
    const faq = await prisma.fAQ.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(faq);
  } catch { res.status(404).json({ error: 'FAQ not found' }); }
});

router.delete('/:id', requireAuth, requirePermission('faqs', 'delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(404).json({ error: 'FAQ not found' }); }
});

export default router;
