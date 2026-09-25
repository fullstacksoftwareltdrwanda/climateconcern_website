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
const legalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
});
// GET /api/legal/:type — public (type = "terms" | "privacy")
router.get('/:type', async (req, res) => {
    const { type } = req.params;
    if (!['terms', 'privacy'].includes(type)) {
        res.status(400).json({ error: 'Type must be "terms" or "privacy"' });
        return;
    }
    const content = await prisma_1.default.legalContent.findUnique({ where: { type } });
    if (!content) {
        res.status(404).json({ error: 'Legal content not found' });
        return;
    }
    res.json(content);
});
// PUT /api/legal/:type — admin only (upsert)
router.put('/:type', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('legal', 'edit'), async (req, res) => {
    const { type } = req.params;
    if (!['terms', 'privacy'].includes(type)) {
        res.status(400).json({ error: 'Type must be "terms" or "privacy"' });
        return;
    }
    const parsed = legalSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const content = await prisma_1.default.legalContent.upsert({
        where: { type },
        update: parsed.data,
        create: { type, ...parsed.data },
    });
    res.json(content);
});
exports.default = router;
//# sourceMappingURL=legal.js.map