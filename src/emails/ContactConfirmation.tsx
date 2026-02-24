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

interface ContactConfirmationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactConfirmation({
  name,
  subject,
  message,
}: ContactConfirmationProps) {
  const firstName = name.split(' ')[0];

  return (
    <Html>
      <Head />
      <Preview>We received your message and will be in touch soon 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={EMAIL_LOGO_URL}
              alt="Peony HQ Kenya"
              width={150}
              height={50}
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={h1}>Message Received! 💌</Heading>
            <Text style={heroText}>
              Hi {firstName}, thank you for reaching out to us. We&apos;ve received your
              message and will get back to you within <strong>24–48 hours</strong>.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Copy of message */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Your Message</Heading>
            <Text style={metaLabel}>Subject</Text>
            <Text style={metaValue}>{subject}</Text>
            <Text style={metaLabel}>Message</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Need faster help? */}
          <Section style={{ ...sectionPadding, textAlign: 'center' }}>
            <Text style={ctaLabel}>Need a faster response?</Text>
            <Link href="https://wa.me/+254111887020" style={waButton}>
              Chat on WhatsApp
            </Link>
            <Text style={footerTextSmall}>We typically reply within minutes on WhatsApp.</Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
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
  padding: '36px 32px 24px',
  textAlign: 'center',
};

const h1: React.CSSProperties = {
  color: '#82001a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const heroText: React.CSSProperties = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0',
};

const h2: React.CSSProperties = {
  color: '#000',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const sectionPadding: React.CSSProperties = {
  padding: '24px 32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const metaLabel: React.CSSProperties = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: '0 0 4px',
};

const metaValue: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const messageBox: React.CSSProperties = {
  backgroundColor: '#fcfbf9',
  border: '1px solid #f8dae2',
  borderRadius: '8px',
  padding: '16px',
};

const messageText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const ctaLabel: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 12px',
};

const waButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#25D366',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
};

const link: React.CSSProperties = {
  color: '#82001a',
  textDecoration: 'underline',
};

const footerTextSmall: React.CSSProperties = {
  color: '#888',
  fontSize: '12px',
  margin: '12px 0 0',
};

const footerSection: React.CSSProperties = {
  backgroundColor: '#f8dae2',
  padding: '20px 32px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#82001a',
  fontSize: '12px',
  margin: '0',
};
