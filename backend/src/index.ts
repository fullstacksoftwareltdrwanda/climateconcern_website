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
import uploadRouter from './routes/upload';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3025',
  'http://192.168.1.65:3025',
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
    : []),
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
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
app.use('/api/upload', uploadRouter);

// ─── Static frontend (production) ────────────────────────────
const DIST_DIR = path.join(__dirname, '../../dist');
app.use(express.static(DIST_DIR));

// ─── SPA catch-all (must be AFTER all /api routes) ───────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CC Backend running at http://localhost:${PORT}`);
  verifyMailer();
});

export default app;
