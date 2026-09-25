import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import { verifyMailer } from './lib/mailer';

import authRouter from './routes/auth';
import adminsRouter from './routes/admins';
import teamRouter from './routes/team';
import servicesRouter from './routes/services';
import trainingRouter from './routes/training';
import faqsRouter from './routes/faqs';
import statsRouter from './routes/stats';
import contactRouter from './routes/contact';
import legalRouter from './routes/legal';
import libraryRouter from './routes/library';
import applicationsRouter from './routes/applications';
import consultantRequestsRouter from './routes/consultantRequests';
import exchangeRateRouter from './routes/exchangeRate';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (admin-only in real production; fine for dev)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/team', teamRouter);
app.use('/api/services', servicesRouter);
app.use('/api/training', trainingRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/legal', legalRouter);
app.use('/api/library', libraryRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/consultant-requests', consultantRequestsRouter);
app.use('/api/exchange-rate', exchangeRateRouter);

// ─── 404 catch-all ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CC Backend running at http://localhost:${PORT}`);
  verifyMailer();
});

export default app;
