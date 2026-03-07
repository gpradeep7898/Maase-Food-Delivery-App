import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /reviews
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.customerId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Can only review delivered orders' });
    }
    const mealId = (await prisma.orderItem.findFirst({ where: { orderId } }))?.mealId ?? '';
    const review = await prisma.review.create({
      data: { orderId, customerId: req.userId!, cookId: order.cookId, mealId, rating: Number(rating), comment },
    });

    // Update cook + meal ratings
    const cookReviews = await prisma.review.aggregate({ where: { cookId: order.cookId }, _avg: { rating: true } });
    await prisma.cook.update({
      where: { id: order.cookId },
      data: { rating: cookReviews._avg.rating ?? 0 },
    });
    if (mealId) {
      const mealReviews = await prisma.review.aggregate({ where: { mealId }, _avg: { rating: true }, _count: true });
      await prisma.meal.update({
        where: { id: mealId },
        data: { rating: mealReviews._avg.rating ?? 0, reviewCount: mealReviews._count },
      });
    }
    res.status(201).json({ data: review });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
