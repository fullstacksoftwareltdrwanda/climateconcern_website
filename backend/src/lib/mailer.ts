import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT ?? 587),
  secure: false, // TLS (STARTTLS) — not SSL
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
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
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const fromName = process.env.MAIL_FROM_NAME ?? 'Climate Concern';
  const fromAddress = process.env.MAIL_FROM_ADDRESS ?? 'noreply@climateconcern.rw';

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
  });
}

/**
 * Verify the SMTP connection on startup (non-fatal — only logs a warning if it fails).
 */
export async function verifyMailer(): Promise<void> {
  try {
    await transporter.verify();
    console.log('✅ Mailer connected to SMTP server');
  } catch (err) {
    console.warn('⚠️  Mailer SMTP verification failed — emails may not send:', err);
  }
}
