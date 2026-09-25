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
const categorySchema = zod_1.z.object({
    catId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    tagline: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    order: zod_1.z.number().int().optional(),
});
const itemSchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    date: zod_1.z.string().optional(),
    link: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    order: zod_1.z.number().int().optional(),
});
// GET /api/library — public (all categories with items)
router.get('/', async (_req, res) => {
    const categories = await prisma_1.default.libraryCategory.findMany({
        include: { items: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
    });
    res.json(categories);
});
// GET /api/library/categories/:id — public
router.get('/categories/:id', async (req, res) => {
    const cat = await prisma_1.default.libraryCategory.findUnique({
        where: { id: req.params.id },
        include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!cat) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    res.json(cat);
});
// POST /api/library/categories — admin only
router.post('/categories', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'edit'), async (req, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const cat = await prisma_1.default.libraryCategory.create({ data: parsed.data, include: { items: true } });
        res.status(201).json(cat);
    }
    catch {
        res.status(409).json({ error: 'Category with that ID already exists' });
    }
});
// PUT /api/library/categories/:id — admin only
router.put('/categories/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'edit'), async (req, res) => {
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const cat = await prisma_1.default.libraryCategory.update({ where: { id: req.params.id }, data: parsed.data, include: { items: true } });
        res.json(cat);
    }
    catch {
        res.status(404).json({ error: 'Category not found' });
    }
});
// DELETE /api/library/categories/:id — admin only (cascades to items)
router.delete('/categories/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.libraryCategory.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Category not found' });
    }
});
// POST /api/library/items — admin only
router.post('/items', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'edit'), async (req, res) => {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const item = await prisma_1.default.libraryItem.create({ data: parsed.data });
    res.status(201).json(item);
});
// PUT /api/library/items/:id — admin only
router.put('/items/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'edit'), async (req, res) => {
    const parsed = itemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const item = await prisma_1.default.libraryItem.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(item);
    }
    catch {
        res.status(404).json({ error: 'Item not found' });
    }
});
// DELETE /api/library/items/:id — admin only
router.delete('/items/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('library', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.libraryItem.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Item not found' });
    }
});
exports.default = router;
//# sourceMappingURL=library.js.map