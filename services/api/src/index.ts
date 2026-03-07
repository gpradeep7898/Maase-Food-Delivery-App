import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import mealsRouter from './routes/meals.routes';
import ordersRouter from './routes/orders.routes';
import paymentsRouter from './routes/payments.routes';
import cooksRouter from './routes/cooks.routes';
import reviewsRouter from './routes/reviews.routes';
import donationsRouter from './routes/donations.routes';
import profilesRouter from './routes/profiles.routes';

const app = express();
const PORT = process.env.PORT ?? 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(express.json());

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/meals', mealsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/cooks', cooksRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/profiles', profilesRouter);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🍛 Maase API running on http://localhost:${PORT}`);
});

export default app;
