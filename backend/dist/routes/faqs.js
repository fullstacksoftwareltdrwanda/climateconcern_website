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
const faqSchema = zod_1.z.object({
    question: zod_1.z.string().min(1),
    answer: zod_1.z.string().min(1),
    order: zod_1.z.number().int().optional(),
});
// GET /api/faqs — public
router.get('/', async (_req, res) => {
    const faqs = await prisma_1.default.fAQ.findMany({ orderBy: { order: 'asc' } });
    res.json(faqs);
});
router.get('/:id', async (req, res) => {
    const faq = await prisma_1.default.fAQ.findUnique({ where: { id: req.params.id } });
    if (!faq) {
        res.status(404).json({ error: 'FAQ not found' });
        return;
    }
    res.json(faq);
});
router.post('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('faqs', 'edit'), async (req, res) => {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const faq = await prisma_1.default.fAQ.create({ data: parsed.data });
    res.status(201).json(faq);
});
router.put('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('faqs', 'edit'), async (req, res) => {
    const parsed = faqSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const faq = await prisma_1.default.fAQ.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(faq);
    }
    catch {
        res.status(404).json({ error: 'FAQ not found' });
    }
});
router.delete('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('faqs', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.fAQ.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'FAQ not found' });
    }
});
exports.default = router;
//# sourceMappingURL=faqs.js.map