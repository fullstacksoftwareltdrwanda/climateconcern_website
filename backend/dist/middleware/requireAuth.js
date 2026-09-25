"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : (typeof req.query.token === 'string' ? req.query.token : null);
    if (!token) {
        res.status(401).json({ error: 'Unauthorized — no token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ?? '');
        const admin = await prisma_1.default.admin.findUnique({ where: { id: decoded.id } });
        if (!admin || !admin.isActive) {
            res.status(401).json({ error: 'Unauthorized — account not found or inactive' });
            return;
        }
        req.admin = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            isMainAdmin: admin.isMainAdmin,
            permissions: admin.permissions ?? {},
        };
        next();
    }
    catch {
        res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
    }
}
//# sourceMappingURL=requireAuth.js.map