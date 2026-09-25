"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentExchangeRate = getCurrentExchangeRate;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const DEFAULT_FALLBACK_RATE = 1475.0;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
async function getSetting(key) {
    try {
        const s = await prisma_1.default.systemSetting.findUnique({ where: { key } });
        return s ? s.value : null;
    }
    catch {
        return null;
    }
}
async function setSetting(key, value) {
    try {
        await prisma_1.default.systemSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
        });
    }
    catch (err) {
        console.error('Failed to save setting:', err);
    }
}
async function fetchLiveRate() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok)
            return null;
        const data = (await res.json());
        if (data.rates && typeof data.rates.RWF === 'number' && data.rates.RWF > 0) {
            return Number(data.rates.RWF.toFixed(2));
        }
        return null;
    }
    catch {
        return null;
    }
}
async function getCurrentExchangeRate() {
    const mode = (await getSetting('usd_rwf_mode')) === 'manual' ? 'manual' : 'auto';
    const savedRateStr = await getSetting('usd_rwf_rate');
    const savedUpdatedStr = await getSetting('usd_rwf_updated');
    const savedRate = savedRateStr ? parseFloat(savedRateStr) : DEFAULT_FALLBACK_RATE;
    if (mode === 'manual') {
        return {
            rate: savedRate || DEFAULT_FALLBACK_RATE,
            mode: 'manual',
            lastUpdated: savedUpdatedStr || new Date().toISOString(),
        };
    }
    // Auto mode: check if cached rate is fresh
    const lastUpdatedTime = savedUpdatedStr ? new Date(savedUpdatedStr).getTime() : 0;
    const isFresh = Date.now() - lastUpdatedTime < CACHE_DURATION_MS;
    if (isFresh && savedRate > 0) {
        return {
            rate: savedRate,
            mode: 'auto',
            lastUpdated: savedUpdatedStr ?? new Date().toISOString(),
        };
    }
    // Fetch fresh live rate
    const liveRate = await fetchLiveRate();
    if (liveRate) {
        const nowIso = new Date().toISOString();
        await setSetting('usd_rwf_rate', liveRate.toString());
        await setSetting('usd_rwf_updated', nowIso);
        await setSetting('usd_rwf_mode', 'auto');
        return {
            rate: liveRate,
            mode: 'auto',
            lastUpdated: nowIso,
        };
    }
    // Fallback
    return {
        rate: savedRate || DEFAULT_FALLBACK_RATE,
        mode: 'auto',
        lastUpdated: savedUpdatedStr || new Date().toISOString(),
    };
}
// GET /api/exchange-rate — public
router.get('/', async (_req, res) => {
    const rateInfo = await getCurrentExchangeRate();
    res.json(rateInfo);
});
const putSchema = zod_1.z.object({
    rate: zod_1.z.number().positive().optional(),
    mode: zod_1.z.enum(['auto', 'manual']),
});
// PUT /api/exchange-rate — admin only
router.put('/', requireAuth_1.requireAuth, async (req, res) => {
    const parsed = putSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const { mode, rate } = parsed.data;
    const nowIso = new Date().toISOString();
    if (mode === 'manual') {
        if (!rate || rate <= 0) {
            res.status(400).json({ error: 'Manual rate must be a positive number' });
            return;
        }
        await setSetting('usd_rwf_rate', rate.toFixed(2));
        await setSetting('usd_rwf_mode', 'manual');
        await setSetting('usd_rwf_updated', nowIso);
        res.json({ rate: Number(rate.toFixed(2)), mode: 'manual', lastUpdated: nowIso });
    }
    else {
        // Switch to auto: trigger immediate live fetch
        const liveRate = await fetchLiveRate();
        const finalRate = liveRate || DEFAULT_FALLBACK_RATE;
        await setSetting('usd_rwf_rate', finalRate.toString());
        await setSetting('usd_rwf_mode', 'auto');
        await setSetting('usd_rwf_updated', nowIso);
        res.json({ rate: finalRate, mode: 'auto', lastUpdated: nowIso });
    }
});
exports.default = router;
//# sourceMappingURL=exchangeRate.js.map