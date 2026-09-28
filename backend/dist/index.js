"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mailer_1 = require("./lib/mailer");
const auth_1 = __importDefault(require("./routes/auth"));
const admins_1 = __importDefault(require("./routes/admins"));
const team_1 = __importDefault(require("./routes/team"));
const services_1 = __importDefault(require("./routes/services"));
const training_1 = __importDefault(require("./routes/training"));
const faqs_1 = __importDefault(require("./routes/faqs"));
const stats_1 = __importDefault(require("./routes/stats"));
const contact_1 = __importDefault(require("./routes/contact"));
const legal_1 = __importDefault(require("./routes/legal"));
const library_1 = __importDefault(require("./routes/library"));
const applications_1 = __importDefault(require("./routes/applications"));
const consultantRequests_1 = __importDefault(require("./routes/consultantRequests"));
const exchangeRate_1 = __importDefault(require("./routes/exchangeRate"));
const upload_1 = __importDefault(require("./routes/upload"));
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, internal calls)
        if (!origin)
            return callback(null, true);
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Ensure uploads directory exists on server
const UPLOADS_DIR = path_1.default.resolve(__dirname, '../uploads');
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express_1.default.static(UPLOADS_DIR));
// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, version: '2.1.0-email-upload-profile', ts: new Date().toISOString() });
});
// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/admins', admins_1.default);
app.use('/api/team', team_1.default);
app.use('/api/services', services_1.default);
app.use('/api/training', training_1.default);
app.use('/api/faqs', faqs_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/legal', legal_1.default);
app.use('/api/library', library_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/consultant-requests', consultantRequests_1.default);
app.use('/api/exchange-rate', exchangeRate_1.default);
app.use('/api/upload', upload_1.default);
// ─── Static frontend (production) ────────────────────────────
const DIST_DIR = path_1.default.resolve(__dirname, '../../dist');
app.use(express_1.default.static(DIST_DIR, {
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
    if (req.path.startsWith('/api') ||
        req.path.startsWith('/uploads') ||
        req.path.startsWith('/assets') ||
        path_1.default.extname(req.path)) {
        res.status(404).json({ error: 'Asset not found' });
        return;
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path_1.default.join(DIST_DIR, 'index.html'));
});
// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 CC Backend running at http://localhost:${PORT}`);
    (0, mailer_1.verifyMailer)();
});
exports.default = app;
//# sourceMappingURL=index.js.map