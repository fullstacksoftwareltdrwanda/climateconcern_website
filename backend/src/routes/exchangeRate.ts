import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

const DEFAULT_FALLBACK_RATE = 1475.0;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

interface RateInfo {
  rate: number;
  mode: 'auto' | 'manual';
  lastUpdated: string;
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const s = await prisma.systemSetting.findUnique({ where: { key } });
    return s ? s.value : null;
  } catch {
    return null;
  }
}

async function setSetting(key: string, value: string): Promise<void> {
  try {
    await prisma.systemSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  } catch (err) {
    console.error('Failed to save setting:', err);
  }
}

async function fetchLiveRate(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (data.rates && typeof data.rates.RWF === 'number' && data.rates.RWF > 0) {
      return Number(data.rates.RWF.toFixed(2));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentExchangeRate(): Promise<RateInfo> {
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
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const rateInfo = await getCurrentExchangeRate();
  res.json(rateInfo);
});

const putSchema = z.object({
  rate: z.number().positive().optional(),
  mode: z.enum(['auto', 'manual']),
});

// PUT /api/exchange-rate — admin only
router.put('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
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
  } else {
    // Switch to auto: trigger immediate live fetch
    const liveRate = await fetchLiveRate();
    const finalRate = liveRate || DEFAULT_FALLBACK_RATE;
    await setSetting('usd_rwf_rate', finalRate.toString());
    await setSetting('usd_rwf_mode', 'auto');
    await setSetting('usd_rwf_updated', nowIso);
    res.json({ rate: finalRate, mode: 'auto', lastUpdated: nowIso });
  }
});

export default router;
