import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

export interface PaymentDetails {
  momoNumber: string;
  momoName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  instructions: string;
}

export const DEFAULT_PAYMENT_DETAILS: PaymentDetails = {
  momoNumber: '0788481439',
  momoName: 'Climate Concern Rwanda',
  bankName: 'Equity Bank',
  bankAccountNumber: '4002200136744',
  bankAccountName: 'Climate Concern Rwanda',
  instructions: 'Transfer the fee via MTN Mobile Money or Equity Bank, then attach your proof of payment receipt below.',
};

const paymentSettingsSchema = z.object({
  momoNumber: z.string().min(1, 'MoMo phone number is required'),
  momoName: z.string().min(1, 'MoMo account name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  bankAccountNumber: z.string().min(1, 'Bank account number is required'),
  bankAccountName: z.string().min(1, 'Bank account name is required'),
  instructions: z.string().optional(),
});

// GET /api/payment-settings — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'payment_details' },
    });

    if (!setting) {
      res.json(DEFAULT_PAYMENT_DETAILS);
      return;
    }

    try {
      const parsed = JSON.parse(setting.value);
      res.json({
        ...DEFAULT_PAYMENT_DETAILS,
        ...parsed,
      });
    } catch {
      res.json(DEFAULT_PAYMENT_DETAILS);
    }
  } catch (err) {
    console.error('Error fetching payment settings:', err);
    res.json(DEFAULT_PAYMENT_DETAILS);
  }
});

// PUT /api/payment-settings — admin only
router.put('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = paymentSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request data', details: parsed.error.flatten() });
    return;
  }

  const dataToSave: PaymentDetails = {
    momoNumber: parsed.data.momoNumber.trim(),
    momoName: parsed.data.momoName.trim(),
    bankName: parsed.data.bankName.trim(),
    bankAccountNumber: parsed.data.bankAccountNumber.trim(),
    bankAccountName: parsed.data.bankAccountName.trim(),
    instructions: parsed.data.instructions?.trim() || DEFAULT_PAYMENT_DETAILS.instructions,
  };

  try {
    const setting = await prisma.systemSetting.upsert({
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
  } catch (err) {
    console.error('Error saving payment settings:', err);
    res.status(500).json({ error: 'Failed to save payment settings' });
  }
});

export default router;
