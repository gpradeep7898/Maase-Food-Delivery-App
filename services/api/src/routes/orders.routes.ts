import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireCook, AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// POST /orders — place order (after payment verified)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { items, addressId, paymentId, rzpOrderId, paymentMethod, cookId } = req.body;

    // Validate meals and stock
    const mealIds = items.map((i: any) => i.mealId);
    const meals = await prisma.meal.findMany({ where: { id: { in: mealIds } } });
    for (const item of items) {
      const meal = meals.find(m => m.id === item.mealId);
      if (!meal || meal.batchRemaining < item.quantity) {
        return res.status(400).json({ error: `${meal?.name ?? 'Meal'} is no longer available` });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      const meal = meals.find(m => m.id === item.mealId)!;
      return sum + meal.price * item.quantity;
    }, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + 10 + 25 + gst;

    // Create order + items in a transaction
    const displayId = `MAS-${Date.now().toString(36).toUpperCase()}`;
    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          displayId,
          customerId: req.userId!,
          cookId,
          addressId,
          subtotal, gst, total,
          deliveryFee: 25, platformFee: 10,
          paymentId, rzpOrderId, paymentMethod: paymentMethod ?? 'upi',
          items: {
            create: items.map((item: any) => {
              const meal = meals.find(m => m.id === item.mealId)!;
              return { mealId: item.mealId, quantity: item.quantity, price: meal.price };
            }),
          },
        },
        include: { items: { include: { meal: true } }, cook: true, address: true },
      });

      // Decrement batch
      for (const item of items) {
        await tx.meal.update({
          where: { id: item.mealId },
          data: { batchRemaining: { decrement: item.quantity } },
        });
      }

      // Create earning record
      const commission = Math.round(subtotal * 0.15);
      await tx.earning.create({
        data: { cookId, orderId: o.id, gross: subtotal, commission, net: subtotal - commission },
      });

      return o;
    });

    // Notify cook via Supabase Realtime
    await supabaseAdmin.channel(`cook-${cookId}`).send({
      type: 'broadcast',
      event: 'new_order',
      payload: { orderId: order.id, displayId: order.displayId, total },
    });

    res.status(201).json({ data: order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/mine — customer's orders
router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.userId! },
      include: { items: { include: { meal: true } }, cook: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders });
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /orders/:id
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { meal: true } }, cook: true, address: true, review: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customerId !== req.userId && order.cookId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ data: order });
  } catch {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /orders/:id/status — cook updates status
router.patch('/:id/status', requireCook, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, ...(status === 'delivered' ? { deliveredAt: new Date() } : {}) },
    });

    // Broadcast status update to customer
    await supabaseAdmin.channel(`order-${order.id}`).send({
      type: 'broadcast',
      event: 'status_update',
      payload: { orderId: order.id, status, updatedAt: new Date().toISOString() },
    });

    res.json({ data: order });
  } catch {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /orders/cook/queue — cook's incoming orders
router.get('/cook/queue', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    if (!cook) return res.status(404).json({ error: 'Cook not found' });

    const orders = await prisma.order.findMany({
      where: { cookId: cook.id, status: { notIn: ['delivered', 'cancelled'] } },
      include: { items: { include: { meal: true } }, customer: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders });
  } catch {
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

export default router;
