import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /donations — feed a neighbour
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { mealId, cookId, quantity = 1, message, paymentId } = req.body;
    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    if (!meal || meal.batchRemaining < quantity) {
      return res.status(400).json({ error: 'Meal not available for donation' });
    }

    const donation = await prisma.$transaction(async (tx) => {
      const d = await tx.donation.create({
        data: { donorId: req.userId!, mealId, cookId, quantity, message, paymentId },
      });
      await tx.meal.update({
        where: { id: mealId },
        data: { batchRemaining: { decrement: quantity } },
      });
      return d;
    });
    res.status(201).json({ data: donation, message: '🤲 Thank you for feeding a neighbour!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /donations/stats — public stats
router.get('/stats', async (req, res) => {
  try {
    const count = await prisma.donation.count();
    const total = await prisma.donation.aggregate({ _sum: { quantity: true } });
    res.json({ data: { donationCount: count, mealsServed: total._sum.quantity ?? 0 } });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
