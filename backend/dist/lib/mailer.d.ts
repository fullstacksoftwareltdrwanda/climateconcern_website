/**
 * Send an email via the configured SMTP transport.
 * @param to      Recipient email address (or comma-separated list)
 * @param subject Email subject line
 * @param html    HTML body of the email
 */
export declare function sendMail(to: string, subject: string, html: string): Promise<void>;
/**
 * Verify the SMTP connection on startup (non-fatal — only logs a warning if it fails).
 */
export declare function verifyMailer(): Promise<void>;
//# sourceMappingURL=mailer.d.ts.map