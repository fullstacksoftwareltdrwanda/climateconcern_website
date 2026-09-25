import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { requireMainAdmin } from '../middleware/requirePermission';

const router = Router();

const DEFAULT_SECTION_PERM = { view: false, edit: false, delete: false };

const SECTIONS = [
  'team', 'services', 'training', 'faqs', 'stats',
  'contact', 'legal', 'library', 'applications', 'consultant_requests', 'admins',
];

function buildPermissions(input: Record<string, unknown>) {
  const perms: Record<string, { view: boolean; edit: boolean; delete: boolean }> = {};
  for (const section of SECTIONS) {
    const s = (input[section] as Partial<{ view: boolean; edit: boolean; delete: boolean }>) ?? {};
    perms[section] = {
      view:   s.view   ?? false,
      edit:   s.edit   ?? false,
      delete: s.delete ?? false,
    };
  }
  return perms;
}

const FULL_PERMISSIONS = () => {
  const perms: Record<string, { view: boolean; edit: boolean; delete: boolean }> = {};
  for (const section of SECTIONS) perms[section] = { view: true, edit: true, delete: true };
  return perms;
};

const createAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  fullAccess: z.boolean().optional(),
  permissions: z.record(z.object({
    view:   z.boolean(),
    edit:   z.boolean(),
    delete: z.boolean(),
  })).optional(),
});

const updateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
  isActive: z.boolean().optional(),
  fullAccess: z.boolean().optional(),
  permissions: z.record(z.object({
    view:   z.boolean(),
    edit:   z.boolean(),
    delete: z.boolean(),
  })).optional(),
});

// GET /api/admins — list all admins (main admin only)
router.get('/', requireAuth, requireMainAdmin, async (_req: Request, res: Response): Promise<void> => {
  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json(admins);
});

// POST /api/admins — create new admin (main admin only)
router.post('/', requireAuth, requireMainAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = createAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { name, email, password, fullAccess, permissions } = parsed.data;

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'An admin with that email already exists' });
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  const resolvedPerms = fullAccess
    ? FULL_PERMISSIONS()
    : buildPermissions((permissions ?? {}) as Record<string, unknown>);

  const admin = await prisma.admin.create({
    data: { name, email, passwordHash: hash, isMainAdmin: false, isActive: true, permissions: resolvedPerms },
    select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, createdAt: true },
  });

  res.status(201).json(admin);
});

// PUT /api/admins/:id — update admin (main admin only, cannot edit main admin)
router.put('/:id', requireAuth, requireMainAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = updateAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const target = await prisma.admin.findUnique({ where: { id: req.params.id } });
  if (!target) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }
  if (target.isMainAdmin) {
    res.status(403).json({ error: 'Cannot modify the main admin account' });
    return;
  }

  const { name, password, isActive, fullAccess, permissions } = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (name) updateData.name = name;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (password) updateData.passwordHash = await bcrypt.hash(password, 12);
  if (fullAccess !== undefined || permissions !== undefined) {
    updateData.permissions = fullAccess
      ? FULL_PERMISSIONS()
      : buildPermissions((permissions ?? {}) as Record<string, unknown>);
  }

  const updated = await prisma.admin.update({
    where: { id: req.params.id },
    data: updateData,
    select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, updatedAt: true },
  });

  res.json(updated);
});

// DELETE /api/admins/:id — delete admin (main admin only, cannot delete self or main admin)
router.delete('/:id', requireAuth, requireMainAdmin, async (req: Request, res: Response): Promise<void> => {
  if (req.params.id === req.admin!.id) {
    res.status(403).json({ error: 'Cannot delete your own account' });
    return;
  }

  const target = await prisma.admin.findUnique({ where: { id: req.params.id } });
  if (!target) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }
  if (target.isMainAdmin) {
    res.status(403).json({ error: 'Cannot delete the main admin account' });
    return;
  }

  await prisma.admin.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
