import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

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
const allowedOriginRegexes = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
  /^https?:\/\/(.+\.)?climateconcern\.rw(:\d+)?$/,
];

const customFrontendUrls = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
  : []);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, internal calls)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = customFrontendUrls.includes(origin);
    const matchesPattern = allowedOriginRegexes.some((regex) => regex.test(origin));

    if (isExplicitlyAllowed || matchesPattern) {
      return callback(null, true);
    }

    // Pass false instead of an Error so Express does not crash with a 500 error
    callback(null, false);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists on server
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, version: '2.1.0-email-upload-profile', ts: new Date().toISOString() });
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
const DIST_DIR = path.resolve(__dirname, '../../dist');
app.use(express.static(DIST_DIR, {
  setHeaders: (res, filePath) => {
    // Never cache index.html so browser always gets the latest asset hashes
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// ─── SPA catch-all (must be AFTER all /api routes) ───────────
app.get('*', (req, res) => {
  // If a request was meant for an asset, api, upload, or file with extension, do NOT serve index.html (which causes MIME type errors)
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/assets') ||
    path.extname(req.path)
  ) {
    res.status(404).json({ error: 'Asset not found' });
    return;
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CC Backend running at http://localhost:${PORT}`);
  verifyMailer();
});

export default app;
