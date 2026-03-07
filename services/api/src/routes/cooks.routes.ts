import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireCook, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /cooks — list verified online cooks
router.get('/', async (req, res) => {
  try {
    const { city, cuisine } = req.query;
    const where: any = { isVerified: true };
    if (city) where.city = city as string;
    if (cuisine) where.cuisine = cuisine as string;

    const cooks = await prisma.cook.findMany({
      where,
      include: { meals: { where: { isAvailable: true, batchRemaining: { gt: 0 } }, take: 3 } },
    });
    res.json({ data: cooks });
  } catch {
    res.status(500).json({ error: 'Failed to fetch cooks' });
  }
});

// GET /cooks/me — cook's own profile
router.get('/me', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({
      where: { userId: req.userId! },
      include: { meals: { orderBy: { createdAt: 'desc' } } },
    });
    if (!cook) return res.status(404).json({ error: 'Cook profile not found' });
    res.json({ data: cook });
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /cooks — onboard new cook
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, bio, phone, cuisine, locality, city, state, avatarColor, upiId } = req.body;
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const cook = await prisma.cook.create({
      data: {
        userId: req.userId!,
        name, bio, phone, cuisine, locality, city, state,
        avatarColor: avatarColor ?? '#F4A300',
        initials, upiId,
      },
    });
    res.status(201).json({ data: cook });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /cooks/me — update cook profile
router.patch('/me', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.update({
      where: { userId: req.userId! },
      data: req.body,
    });
    res.json({ data: cook });
  } catch {
    res.status(500).json({ error: 'Failed to update cook' });
  }
});

// PATCH /cooks/me/toggle-online — go online/offline
router.patch('/me/toggle-online', requireCook, async (req: AuthRequest, res) => {
  try {
    const cook = await prisma.cook.findUnique({ where: { userId: req.userId! } });
    if (!cook) return res.status(404).json({ error: 'Cook not found' });
    const updated = await prisma.cook.update({
      where: { userId: req.userId! },
      data: { isOnline: !cook.isOnline },
    });
    res.json({ data: { isOnline: updated.isOnline } });
  } catch {
    res.status(500).json({ error: 'Failed to toggle online status' });
  }
});

// GET /cooks/:id
router.get('/:id', async (req, res) => {
  try {
    const cook = await prisma.cook.findUnique({
      where: { id: req.params.id },
      include: {
        meals: { where: { isAvailable: true }, orderBy: { createdAt: 'desc' } },
        reviews: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!cook) return res.status(404).json({ error: 'Cook not found' });
    res.json({ data: cook });
  } catch {
    res.status(500).json({ error: 'Failed to fetch cook' });
  }
});

export default router;
