import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireCook, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /meals — list available meals, filter by cuisine/tags/city
router.get('/', async (req, res) => {
  try {
    const { cuisine, city, tag, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isAvailable: true, batchRemaining: { gt: 0 } };
    if (cuisine) where.cuisine = cuisine as string;
    if (city) where.cook = { city: city as string };
    if (tag) where.tags = { has: tag as string };

    const [meals, count] = await Promise.all([
      prisma.meal.findMany({
        where,
        include: { cook: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.meal.count({ where }),
    ]);

    res.json({ data: meals, count, page: Number(page), pageSize: Number(limit), totalPages: Math.ceil(count / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// GET /meals/:id
router.get('/:id', async (req, res) => {
  try {
    const meal = await prisma.meal.findUnique({
      where: { id: req.params.id },
      include: { cook: true, reviews: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json({ data: meal });
  } catch {
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// POST /meals — cook creates a meal
router.post('/', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    if (!cook) return res.status(404).json({ error: 'Cook profile not found' });

    const { name, description, emoji, cuisine, price, batchTotal, items, tags, cookedAt, story } = req.body;
    const meal = await prisma.meal.create({
      data: {
        cookId: cook.id,
        name, description, emoji, cuisine, price: Number(price),
        batchTotal: Number(batchTotal), batchRemaining: Number(batchTotal),
        items, tags, cookedAt, story,
        batchDate: new Date(),
      },
      include: { cook: true },
    });
    res.status(201).json({ data: meal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /meals/:id — cook updates their meal
router.patch('/:id', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    const meal = await prisma.meal.findUnique({ where: { id: req.params.id } });
    if (!meal || meal.cookId !== cook?.id) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.meal.update({
      where: { id: req.params.id },
      data: req.body,
      include: { cook: true },
    });
    res.json({ data: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// DELETE /meals/:id
router.delete('/:id', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    const meal = await prisma.meal.findUnique({ where: { id: req.params.id } });
    if (!meal || meal.cookId !== cook?.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.meal.update({ where: { id: req.params.id }, data: { isAvailable: false } });
    res.json({ message: 'Meal removed from listing' });
  } catch {
    res.status(500).json({ error: 'Failed to remove meal' });
  }
});

export default router;
