import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Peony HQ Kenya <onboarding@resend.dev>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'peonyhqkenya@gmail.com';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://peonyhq.co.ke';
// Logo URL for emails — must be a publicly accessible URL (not localhost).
// Defaults to the production domain so it always works once deployed.
export const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL ?? 'https://peonyhq.co.ke/logo-email.png';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  // Skip sending if no API key is configured (development without Resend)
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    console.log(`[Email skipped – no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
    return { success: true, skipped: true };
  }

  // In test mode (EMAIL_TEST_OVERRIDE set), redirect all emails to one address.
  // Resend's sandbox sender (onboarding@resend.dev) only allows delivery to the
  // account owner's email. Remove EMAIL_TEST_OVERRIDE once your domain is verified.
  const testOverride = process.env.EMAIL_TEST_OVERRIDE;
  const recipient = testOverride ? [testOverride] : (Array.isArray(to) ? to : [to]);

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: recipient,
      subject,
      react,
    });

    if (error) {
      console.error('[Resend] Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[Resend] Unexpected error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}
