import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export const DEFAULT_USD_RWF_RATE = 1475.0;

export interface ExchangeRateData {
  rate: number;
  mode: 'auto' | 'manual';
  lastUpdated: string;
}

export function convertUsdToRwf(usdAmount: number, rate: number = DEFAULT_USD_RWF_RATE): number {
  return Math.round(usdAmount * (rate || DEFAULT_USD_RWF_RATE));
}

export function formatRwf(rwfAmount: number): string {
  return `${new Intl.NumberFormat('en-US').format(rwfAmount)} RWF`;
}

export function formatUsd(usdAmount: number): string {
  return `$${new Intl.NumberFormat('en-US').format(usdAmount)} USD`;
}

export function formatPriceDisplay(usdAmount: number, rate: number = DEFAULT_USD_RWF_RATE) {
  const rwf = convertUsdToRwf(usdAmount, rate);
  return {
    usd: formatUsd(usdAmount),
    rwf: formatRwf(rwf),
    approxRwf: `≈ ${formatRwf(rwf)}`,
    fullLabel: `${formatUsd(usdAmount)} (~${formatRwf(rwf)})`,
  };
}

let cachedRate: ExchangeRateData = {
  rate: DEFAULT_USD_RWF_RATE,
  mode: 'auto',
  lastUpdated: new Date().toISOString(),
};

try {
  const stored = localStorage.getItem('cc_exchange_rate');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.rate && typeof parsed.rate === 'number') {
      cachedRate = parsed;
    }
  }
} catch {
  // Ignore
}

export function useExchangeRate() {
  const [data, setData] = useState<ExchangeRateData>(cachedRate);
  const [loading, setLoading] = useState(false);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ExchangeRateData>('/exchange-rate');
      if (res && typeof res.rate === 'number') {
        setData(res);
        cachedRate = res;
        localStorage.setItem('cc_exchange_rate', JSON.stringify(res));
      }
    } catch {
      // Keep cached or fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const updateRate = async (newMode: 'auto' | 'manual', manualRate?: number) => {
    const res = await api.put<ExchangeRateData>('/exchange-rate', {
      mode: newMode,
      rate: manualRate,
    });
    setData(res);
    cachedRate = res;
    localStorage.setItem('cc_exchange_rate', JSON.stringify(res));
    return res;
  };

  return {
    rate: data.rate || DEFAULT_USD_RWF_RATE,
    mode: data.mode,
    lastUpdated: data.lastUpdated,
    loading,
    refreshRate: fetchRate,
    updateRate,
  };
}
