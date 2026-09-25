"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
exports.verifyMailer = verifyMailer;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailUser = process.env.MAIL_USERNAME || 'apps@programage.com';
const mailPass = process.env.MAIL_PASSWORD || 'wmnxdffulyjbptvs';
const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
const mailPort = Number(process.env.MAIL_PORT || 587);
const transporter = nodemailer_1.default.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // TLS (STARTTLS) — not SSL
    auth: {
        user: mailUser,
        pass: mailPass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
/**
 * Send an email via the configured SMTP transport.
 * @param to      Recipient email address (or comma-separated list)
 * @param subject Email subject line
 * @param html    HTML body of the email
 */
async function sendMail(to, subject, html) {
    const fromName = process.env.MAIL_FROM_NAME ?? 'Climate Concern';
    const fromAddress = process.env.MAIL_FROM_ADDRESS ?? mailUser;
    try {
        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromAddress}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 [Mailer] Email sent successfully to: ${to} (Message ID: ${info.messageId})`);
    }
    catch (err) {
        console.error(`❌ [Mailer] Delivery failed to ${to}:`, err);
        throw err;
    }
}
/**
 * Verify the SMTP connection on startup (non-fatal — only logs a warning if it fails).
 */
async function verifyMailer() {
    try {
        await transporter.verify();
        console.log(`✅ Mailer connected to SMTP server (${mailHost} as ${mailUser})`);
    }
    catch (err) {
        console.warn('⚠️  Mailer SMTP verification failed — check SMTP credentials:', err);
    }
}
//# sourceMappingURL=mailer.js.map