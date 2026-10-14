"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PAYMENT_DETAILS = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
exports.DEFAULT_PAYMENT_DETAILS = {
    momoNumber: '0788481439',
    momoName: 'Climate Concern Rwanda',
    bankName: 'Equity Bank',
    bankAccountNumber: '4002200136744',
    bankAccountName: 'Climate Concern Rwanda',
    instructions: 'Transfer the fee via MTN Mobile Money or Equity Bank, then attach your proof of payment receipt below.',
};
const paymentSettingsSchema = zod_1.z.object({
    momoNumber: zod_1.z.string().min(1, 'MoMo phone number is required'),
    momoName: zod_1.z.string().min(1, 'MoMo account name is required'),
    bankName: zod_1.z.string().min(1, 'Bank name is required'),
    bankAccountNumber: zod_1.z.string().min(1, 'Bank account number is required'),
    bankAccountName: zod_1.z.string().min(1, 'Bank account name is required'),
    instructions: zod_1.z.string().optional(),
});
// GET /api/payment-settings — public
router.get('/', async (_req, res) => {
    try {
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: { key: 'payment_details' },
        });
        if (!setting) {
            res.json(exports.DEFAULT_PAYMENT_DETAILS);
            return;
        }
        try {
            const parsed = JSON.parse(setting.value);
            res.json({
                ...exports.DEFAULT_PAYMENT_DETAILS,
                ...parsed,
            });
        }
        catch {
            res.json(exports.DEFAULT_PAYMENT_DETAILS);
        }
    }
    catch (err) {
        console.error('Error fetching payment settings:', err);
        res.json(exports.DEFAULT_PAYMENT_DETAILS);
    }
});
// PUT /api/payment-settings — admin only
router.put('/', requireAuth_1.requireAuth, async (req, res) => {
    const parsed = paymentSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request data', details: parsed.error.flatten() });
        return;
    }
    const dataToSave = {
        momoNumber: parsed.data.momoNumber.trim(),
        momoName: parsed.data.momoName.trim(),
        bankName: parsed.data.bankName.trim(),
        bankAccountNumber: parsed.data.bankAccountNumber.trim(),
        bankAccountName: parsed.data.bankAccountName.trim(),
        instructions: parsed.data.instructions?.trim() || exports.DEFAULT_PAYMENT_DETAILS.instructions,
    };
    try {
        const setting = await prisma_1.default.systemSetting.upsert({
            where: { key: 'payment_details' },
            create: {
                key: 'payment_details',
                value: JSON.stringify(dataToSave),
            },
            update: {
                value: JSON.stringify(dataToSave),
            },
        });
        res.json(JSON.parse(setting.value));
    }
    catch (err) {
        console.error('Error saving payment settings:', err);
        res.status(500).json({ error: 'Failed to save payment settings' });
    }
});
exports.default = router;
//# sourceMappingURL=paymentSettings.js.map