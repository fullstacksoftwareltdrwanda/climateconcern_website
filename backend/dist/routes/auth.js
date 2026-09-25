"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const { email, password } = parsed.data;
    const admin = await prisma_1.default.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, admin.passwordHash);
    if (!valid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: admin.id }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' });
    res.json({
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            isMainAdmin: admin.isMainAdmin,
            permissions: admin.permissions,
        },
    });
});
// GET /api/auth/me
router.get('/me', requireAuth_1.requireAuth, async (req, res) => {
    const admin = await prisma_1.default.admin.findUnique({
        where: { id: req.admin.id },
        select: { id: true, name: true, email: true, isMainAdmin: true, permissions: true, createdAt: true },
    });
    if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
    }
    res.json(admin);
});
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    currentPassword: zod_1.z.string().min(1).optional(),
    newPassword: zod_1.z.string().min(6).optional(),
});
// Profile update handler (supports both PUT and PATCH)
const handleProfileUpdate = async (req, res) => {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        return;
    }
    const { name, email, currentPassword, newPassword } = parsed.data;
    const admin = await prisma_1.default.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
    }
    const updateData = {};
    if (name && name.trim())
        updateData.name = name.trim();
    if (email && email.trim() && email.trim().toLowerCase() !== admin.email.toLowerCase()) {
        const exists = await prisma_1.default.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (exists && exists.id !== admin.id) {
            res.status(400).json({ error: 'Email is already in use by another account' });
            return;
        }
        updateData.email = email.trim().toLowerCase();
    }
    if (newPassword) {
        if (!currentPassword) {
            res.status(400).json({ error: 'Current password is required to change password' });
            return;
        }
        const valid = await bcryptjs_1.default.compare(currentPassword, admin.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Current password is incorrect' });
            return;
        }
        updateData.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    }
    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No changes provided' });
        return;
    }
    const updated = await prisma_1.default.admin.update({
        where: { id: req.admin.id },
        data: updateData,
        select: { id: true, name: true, email: true, isMainAdmin: true, permissions: true },
    });
    // Re-issue JWT token with the new details
    const token = jsonwebtoken_1.default.sign({ id: updated.id }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' });
    res.json({
        message: 'Profile updated successfully',
        admin: updated,
        token,
    });
};
router.put('/profile', requireAuth_1.requireAuth, handleProfileUpdate);
router.patch('/profile', requireAuth_1.requireAuth, handleProfileUpdate);
// POST /api/auth/test-email — test SMTP sending
router.post('/test-email', requireAuth_1.requireAuth, async (req, res) => {
    const targetEmail = req.body?.email || req.admin?.email;
    if (!targetEmail) {
        res.status(400).json({ error: 'Target email is required' });
        return;
    }
    try {
        const { sendMail } = await Promise.resolve().then(() => __importStar(require('../lib/mailer')));
        await sendMail(targetEmail, 'Climate Concern — SMTP Test Email', `
        <div style="font-family:sans-serif;padding:20px;max-width:500px;border:1px solid #ccebd7;border-radius:12px;">
          <h2 style="color:#00652c;margin-top:0;">✅ SMTP Mailer is Working!</h2>
          <p>This is a test email sent from the Climate Concern Rwanda backend system.</p>
          <p style="font-size:13px;color:#666;">Triggered by: <strong>${req.admin?.name} (${req.admin?.email})</strong></p>
          <p style="font-size:12px;color:#999;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `);
        res.json({ success: true, message: `Test email successfully dispatched to ${targetEmail}` });
    }
    catch (err) {
        res.status(500).json({
            error: 'Failed to send test email',
            details: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map