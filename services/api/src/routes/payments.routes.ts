import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /payments/create-order — create Razorpay order
router.post('/create-order', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, receipt } = req.body; // amount in paise
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: receipt ?? `rcpt_${Date.now()}`,
    });
    res.json({ data: order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /payments/verify — verify Razorpay signature
router.post('/verify', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    res.json({ verified: true, paymentId: razorpayPaymentId });
  } catch {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET /payments/cook/earnings — cook earnings summary
router.get('/cook/earnings', requireAuth, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    if (!cook) return res.status(404).json({ error: 'Cook not found' });

    const earnings = await prisma.earning.findMany({
      where: { cookId: cook.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totalEarned = earnings.reduce((sum, e) => sum + e.net, 0);
    const unsettled = earnings.filter(e => !e.settledAt).reduce((sum, e) => sum + e.net, 0);

    res.json({ data: { earnings, totalEarned, unsettled } });
  } catch {
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

export default router;
