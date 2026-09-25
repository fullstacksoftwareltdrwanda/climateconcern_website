"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const requirePermission_1 = require("../middleware/requirePermission");
const router = (0, express_1.Router)();
const teamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1),
    isFounder: zod_1.z.boolean().optional(),
    initials: zod_1.z.string().min(1).max(3),
    bio: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    education: zod_1.z.array(zod_1.z.string()).optional(),
    keyAreas: zod_1.z.array(zod_1.z.string()).optional(),
    order: zod_1.z.number().int().optional(),
});
// GET /api/team — public
router.get('/', async (_req, res) => {
    const members = await prisma_1.default.teamMember.findMany({ orderBy: { order: 'asc' } });
    res.json(members);
});
// GET /api/team/:id — public
router.get('/:id', async (req, res) => {
    const member = await prisma_1.default.teamMember.findUnique({ where: { id: req.params.id } });
    if (!member) {
        res.status(404).json({ error: 'Team member not found' });
        return;
    }
    res.json(member);
});
// POST /api/team — admin only
router.post('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('team', 'edit'), async (req, res) => {
    const parsed = teamSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const member = await prisma_1.default.teamMember.create({ data: { ...parsed.data, education: parsed.data.education ?? [], keyAreas: parsed.data.keyAreas ?? [] } });
    res.status(201).json(member);
});
// PUT /api/team/:id — admin only
router.put('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('team', 'edit'), async (req, res) => {
    const parsed = teamSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const member = await prisma_1.default.teamMember.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(member);
    }
    catch {
        res.status(404).json({ error: 'Team member not found' });
    }
});
// DELETE /api/team/:id — admin only
router.delete('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('team', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.teamMember.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Team member not found' });
    }
});
exports.default = router;
//# sourceMappingURL=team.js.map