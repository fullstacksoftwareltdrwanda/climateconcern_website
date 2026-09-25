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
const serviceSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    tabLabel: zod_1.z.string().min(1),
    headline: zod_1.z.string().min(1),
    shortSummary: zod_1.z.string().min(1),
    deliverables: zod_1.z.array(zod_1.z.string()).optional(),
    subAreas: zod_1.z.array(zod_1.z.object({ title: zod_1.z.string(), description: zod_1.z.string() })).optional(),
    cta: zod_1.z.string().min(1),
    ctaLink: zod_1.z.string().min(1),
    color: zod_1.z.string().min(1),
    order: zod_1.z.number().int().optional(),
});
// GET /api/services — public
router.get('/', async (_req, res) => {
    const services = await prisma_1.default.service.findMany({ orderBy: { order: 'asc' } });
    res.json(services);
});
router.get('/:id', async (req, res) => {
    const service = await prisma_1.default.service.findUnique({ where: { id: req.params.id } });
    if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
    }
    res.json(service);
});
router.post('/', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('services', 'edit'), async (req, res) => {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const service = await prisma_1.default.service.create({ data: { ...parsed.data, deliverables: parsed.data.deliverables ?? [], subAreas: parsed.data.subAreas ?? [] } });
        res.status(201).json(service);
    }
    catch {
        res.status(409).json({ error: 'Service with that ID already exists' });
    }
});
router.put('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('services', 'edit'), async (req, res) => {
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    try {
        const service = await prisma_1.default.service.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(service);
    }
    catch {
        res.status(404).json({ error: 'Service not found' });
    }
});
router.delete('/:id', requireAuth_1.requireAuth, (0, requirePermission_1.requirePermission)('services', 'delete'), async (req, res) => {
    try {
        await prisma_1.default.service.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    }
    catch {
        res.status(404).json({ error: 'Service not found' });
    }
});
exports.default = router;
//# sourceMappingURL=services.js.map