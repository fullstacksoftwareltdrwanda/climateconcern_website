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
const statSchema = zod_1.z.object({
    statId: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
    unit: zod_1.z.string().min(1),
    tag: zod_1.z.string().min(1),
    order: zod_1.z.number().int().optional(),
});
// GET /api/stats — public
router.get('/', async (_req, res) => {
    const stats = await prisma_1.default.stat.findMany({ orderBy: { order: 'asc' } });
    res.json(stats);
});
router.get('/:id', async (req, res) => {
    const stat = await prisma_1.default.stat.findUnique({ where: { id: req.params.id } });
    if (!stat) {
        res.status(404).json({ error: 'Stat not found' });
        return;
    }
    res.json(stat);
});
router.post('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('stats', 'edit'), async (req, res) => {
    const parsed = statSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const stat = await prisma_1.default.stat.create({ data: parsed.data });
        res.status(201).json(stat);
    }
    catch {
        res.status(409).json({ error: 'Stat with that ID already exists' });
    }
});
router.put('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('stats', 'edit'), async (req, res) => {
    const parsed = statSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const stat = await prisma_1.default.stat.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(stat);
    }
    catch {
        res.status(404).json({ error: 'Stat not found' });
    }
});
router.delete('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('stats', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.stat.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Stat not found' });
    }
});
exports.default = router;
//# sourceMappingURL=stats.js.map