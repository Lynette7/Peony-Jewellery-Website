import crypto from 'crypto';
import { SITE_URL } from '@/lib/email';

/**
 * Secret used to sign unsubscribe tokens.
 * Falls back to RESEND_API_KEY so no extra env var is needed.
 */
const SECRET = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET
  ?? process.env.RESEND_API_KEY
  ?? 'peony-newsletter-default-key';

/** Create an HMAC-SHA256 token for a given email. */
export function createUnsubscribeToken(email: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(email.toLowerCase().trim())
    .digest('hex');
}

/** Verify that the token matches the email. */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(token, 'hex'),
  );
}

/** Build the full unsubscribe URL for an email address. */
export function getUnsubscribeUrl(email: string): string {
  const token = createUnsubscribeToken(email);
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
