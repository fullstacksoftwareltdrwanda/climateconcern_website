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
const contactSchema = zod_1.z.object({
    phone: zod_1.z.string().min(1),
    phoneClean: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    physicalAddress: zod_1.z.string().min(1),
    xHandle: zod_1.z.string(),
    xUrl: zod_1.z.string(),
    linkedinHandle: zod_1.z.string(),
    linkedinUrl: zod_1.z.string(),
    igHandle: zod_1.z.string(),
    igUrl: zod_1.z.string(),
});
// GET /api/contact — public (singleton row)
router.get('/', async (_req, res) => {
    let info = await prisma_1.default.contactInfo.findUnique({ where: { id: 'singleton' } });
    if (!info) {
        // Return empty default if not seeded yet
        res.json(null);
        return;
    }
    res.json(info);
});
// PUT /api/contact — admin only (upsert)
router.put('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('contact', 'edit'), async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const info = await prisma_1.default.contactInfo.upsert({
        where: { id: 'singleton' },
        update: parsed.data,
        create: { id: 'singleton', ...parsed.data },
    });
    res.json(info);
});
exports.default = router;
//# sourceMappingURL=contact.js.map