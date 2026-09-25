"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const requirePermission_1 = require("../middleware/requirePermission");
const router = (0, express_1.Router)();
const DEFAULT_SECTION_PERM = { view: false, edit: false, delete: false };
const SECTIONS = [
    'team', 'services', 'training', 'faqs', 'stats',
    'contact', 'legal', 'library', 'applications', 'consultant_requests', 'admins',
];
function buildPermissions(input) {
    const perms = {};
    for (const section of SECTIONS) {
        const s = input[section] ?? {};
        perms[section] = {
            view: s.view ?? false,
            edit: s.edit ?? false,
            delete: s.delete ?? false,
        };
    }
    return perms;
}
const FULL_PERMISSIONS = () => {
    const perms = {};
    for (const section of SECTIONS)
        perms[section] = { view: true, edit: true, delete: true };
    return perms;
};
const createAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    fullAccess: zod_1.z.boolean().optional(),
    permissions: zod_1.z.record(zod_1.z.object({
        view: zod_1.z.boolean(),
        edit: zod_1.z.boolean(),
        delete: zod_1.z.boolean(),
    })).optional(),
});
const updateAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(8).optional(),
    isActive: zod_1.z.boolean().optional(),
    fullAccess: zod_1.z.boolean().optional(),
    permissions: zod_1.z.record(zod_1.z.object({
        view: zod_1.z.boolean(),
        edit: zod_1.z.boolean(),
        delete: zod_1.z.boolean(),
    })).optional(),
});
// GET /api/admins — list all admins (main admin only)
router.get('/', requireAuth_1.requireAuth, requirePermission_1.requireMainAdmin, async (_req, res) => {
    const admins = await prisma_1.default.admin.findMany({
        select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
    });
    res.json(admins);
});
// POST /api/admins — create new admin (main admin only)
router.post('/', requireAuth_1.requireAuth, requirePermission_1.requireMainAdmin, async (req, res) => {
    const parsed = createAdminSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const { name, email, password, fullAccess, permissions } = parsed.data;
    const existing = await prisma_1.default.admin.findUnique({ where: { email } });
    if (existing) {
        res.status(409).json({ error: 'An admin with that email already exists' });
        return;
    }
    const hash = await bcryptjs_1.default.hash(password, 12);
    const resolvedPerms = fullAccess
        ? FULL_PERMISSIONS()
        : buildPermissions((permissions ?? {}));
    const admin = await prisma_1.default.admin.create({
        data: { name, email, passwordHash: hash, isMainAdmin: false, isActive: true, permissions: resolvedPerms },
        select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, createdAt: true },
    });
    res.status(201).json(admin);
});
// PUT /api/admins/:id — update admin (main admin only, cannot edit main admin)
router.put('/:id', requireAuth_1.requireAuth, requirePermission_1.requireMainAdmin, async (req, res) => {
    const parsed = updateAdminSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const target = await prisma_1.default.admin.findUnique({ where: { id: req.params.id } });
    if (!target) {
        res.status(404).json({ error: 'Admin not found' });
        return;
    }
    if (target.isMainAdmin) {
        res.status(403).json({ error: 'Cannot modify the main admin account' });
        return;
    }
    const { name, password, isActive, fullAccess, permissions } = parsed.data;
    const updateData = {};
    if (name)
        updateData.name = name;
    if (isActive !== undefined)
        updateData.isActive = isActive;
    if (password)
        updateData.passwordHash = await bcryptjs_1.default.hash(password, 12);
    if (fullAccess !== undefined || permissions !== undefined) {
        updateData.permissions = fullAccess
            ? FULL_PERMISSIONS()
            : buildPermissions((permissions ?? {}));
    }
    const updated = await prisma_1.default.admin.update({
        where: { id: req.params.id },
        data: updateData,
        select: { id: true, name: true, email: true, isMainAdmin: true, isActive: true, permissions: true, updatedAt: true },
    });
    res.json(updated);
});
// DELETE /api/admins/:id — delete admin (main admin only, cannot delete self or main admin)
router.delete('/:id', requireAuth_1.requireAuth, requirePermission_1.requireMainAdmin, async (req, res) => {
    if (req.params.id === req.admin.id) {
        res.status(403).json({ error: 'Cannot delete your own account' });
        return;
    }
    const target = await prisma_1.default.admin.findUnique({ where: { id: req.params.id } });
    if (!target) {
        res.status(404).json({ error: 'Admin not found' });
        return;
    }
    if (target.isMainAdmin) {
        res.status(403).json({ error: 'Cannot delete the main admin account' });
        return;
    }
    await prisma_1.default.admin.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=admins.js.map