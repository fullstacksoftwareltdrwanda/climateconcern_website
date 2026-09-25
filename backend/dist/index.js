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
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3025',
    'http://192.168.1.65:3025',
    ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
        : []),
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
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
const DIST_DIR = path_1.default.join(__dirname, '../../dist');
app.use(express_1.default.static(DIST_DIR));
// ─── SPA catch-all (must be AFTER all /api routes) ───────────
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(DIST_DIR, 'index.html'));
});
// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 CC Backend running at http://localhost:${PORT}`);
    (0, mailer_1.verifyMailer)();
});
exports.default = app;
//# sourceMappingURL=index.js.map