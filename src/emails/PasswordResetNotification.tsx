import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { SITE_URL, EMAIL_LOGO_URL } from '@/lib/email';

interface PasswordResetNotificationProps {
  email: string;
}

export default function PasswordResetNotification({ email }: PasswordResetNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Password reset requested for your Peony HQ account</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={EMAIL_LOGO_URL}
              alt="Peony HQ Kenya"
              width={80}
              height={80}
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={lockBadge}>🔒 Password Reset</Text>
            <Heading style={h1}>Reset Your Password</Heading>
            <Text style={heroText}>
              Hi there! We received a request to reset the password for the Peony HQ
              account linked to <strong>{email}</strong>.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Instructions */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Here&apos;s what to do next</Heading>

            <Section style={stepCard}>
              <Text style={stepText}>
                <strong>1.</strong> Check your inbox for a separate email from our
                authentication provider with the subject{' '}
                <strong>&quot;Reset Your Password&quot;</strong>.
              </Text>
            </Section>

            <Section style={stepCard}>
              <Text style={stepText}>
                <strong>2.</strong> Click the <strong>reset link</strong> in that email.
                It will take you to a page where you can set a new password.
              </Text>
            </Section>

            <Section style={stepCard}>
              <Text style={stepText}>
                <strong>3.</strong> Choose a strong password — at least 8 characters with
                a mix of letters, numbers, and symbols.
              </Text>
            </Section>
          </Section>

          {/* Warning */}
          <Section style={warningWrapper}>
            <Section style={warningBanner}>
              <Text style={warningText}>
                ⚠️ <strong>Can&apos;t find the reset email?</strong> Check your spam
                or junk folder. The email may take a few minutes to arrive.
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Didn't request */}
          <Section style={sectionPadding}>
            <Text style={mutedText}>
              If you didn&apos;t request a password reset, you can safely ignore both
              emails — your password will remain unchanged and your account is secure.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ ...sectionPadding, textAlign: 'center', paddingTop: '0' }}>
            <Link href={`${SITE_URL}/account/login`} style={ctaButton}>
              Go to Login
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions? Chat with us on{' '}
              <Link href="https://wa.me/+254111887020" style={link}>
                WhatsApp
              </Link>{' '}
              or email{' '}
              <Link href="mailto:hello@peonyhq.co.ke" style={link}>
                hello@peonyhq.co.ke
              </Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Peony HQ Kenya ·{' '}
              <Link href={SITE_URL} style={link}>
                peonyhq.co.ke
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#fcfbf9',
  fontFamily: 'Georgia, serif',
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #e5e5e5',
};

const header: React.CSSProperties = {
  backgroundColor: '#82001a',
  padding: '24px 32px',
  textAlign: 'center',
};

const heroSection: React.CSSProperties = {
  padding: '36px 32px 8px',
  textAlign: 'center',
};

const lockBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#fff8e1',
  color: '#5d4037',
  fontSize: '13px',
  fontWeight: '700',
  padding: '4px 14px',
  borderRadius: '999px',
  marginBottom: '12px',
  letterSpacing: '0.04em',
};

const h1: React.CSSProperties = {
  color: '#82001a',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const h2: React.CSSProperties = {
  color: '#000',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const heroText: React.CSSProperties = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 8px',
};

const sectionPadding: React.CSSProperties = {
  padding: '24px 32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const stepCard: React.CSSProperties = {
  backgroundColor: '#fcfbf9',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '10px',
};

const stepText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const warningWrapper: React.CSSProperties = {
  padding: '0 32px 8px',
};

const warningBanner: React.CSSProperties = {
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: '8px',
  padding: '16px 20px',
};

const warningText: React.CSSProperties = {
  color: '#5d4037',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const mutedText: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center',
};

const ctaButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#82001a',
  color: '#ffffff',
  padding: '14px 36px',
  borderRadius: '999px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '15px',
};

const link: React.CSSProperties = {
  color: '#82001a',
  textDecoration: 'underline',
};

const footerSection: React.CSSProperties = {
  backgroundColor: '#f8dae2',
  padding: '20px 32px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#82001a',
  fontSize: '12px',
  margin: '0 0 4px',
};
