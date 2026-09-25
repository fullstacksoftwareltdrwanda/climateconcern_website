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
const courseSchema = zod_1.z.object({
    courseId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    subtitle: zod_1.z.string().min(1),
    badge: zod_1.z.string().min(1),
    overview: zod_1.z.string().optional().default(''),
    modules: zod_1.z.array(zod_1.z.string()).optional().default([]),
    phase1Price: zod_1.z.number().optional().default(50),
    phase2Price: zod_1.z.number().optional().default(50),
    phase1Title: zod_1.z.string().optional(),
    phase1Desc: zod_1.z.string().optional(),
    phase2Title: zod_1.z.string().optional(),
    phase2Desc: zod_1.z.string().optional(),
    order: zod_1.z.number().int().optional(),
});
// GET /api/training — public
router.get('/', async (_req, res) => {
    const courses = await prisma_1.default.trainingCourse.findMany({ orderBy: { order: 'asc' } });
    res.json(courses);
});
router.get('/:id', async (req, res) => {
    const course = await prisma_1.default.trainingCourse.findUnique({ where: { id: req.params.id } });
    if (!course) {
        res.status(404).json({ error: 'Training course not found' });
        return;
    }
    res.json(course);
});
router.post('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('training', 'edit'), async (req, res) => {
    const parsed = courseSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const course = await prisma_1.default.trainingCourse.create({ data: { ...parsed.data, modules: parsed.data.modules ?? [] } });
        res.status(201).json(course);
    }
    catch {
        res.status(409).json({ error: 'Training course with that ID already exists' });
    }
});
router.put('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('training', 'edit'), async (req, res) => {
    const parsed = courseSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const course = await prisma_1.default.trainingCourse.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(course);
    }
    catch {
        res.status(404).json({ error: 'Training course not found' });
    }
});
router.delete('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('training', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.trainingCourse.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Training course not found' });
    }
});
exports.default = router;
//# sourceMappingURL=training.js.map