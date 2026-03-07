import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /profiles/me
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    let profile = await prisma.profile.findUnique({
      where: { id: req.userId! },
      include: { addresses: true },
    });
    if (!profile) {
      // Auto-create on first login
      profile = await prisma.profile.create({
        data: { id: req.userId!, phone: '', dietPreferences: [] },
        include: { addresses: true },
      });
    }
    res.json({ data: profile });
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /profiles/me
router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, email, avatarUrl, dietPreferences } = req.body;
    const profile = await prisma.profile.update({
      where: { id: req.userId! },
      data: { name, email, avatarUrl, dietPreferences },
      include: { addresses: true },
    });
    res.json({ data: profile });
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /profiles/me/addresses
router.post('/me/addresses', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { label, line1, line2, city, state, pincode, lat, lng, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({ where: { profileId: req.userId! }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: { profileId: req.userId!, label, line1, line2, city, state, pincode, lat, lng, isDefault: !!isDefault },
    });
    res.status(201).json({ data: address });
  } catch {
    res.status(500).json({ error: 'Failed to save address' });
  }
});

export default router;
