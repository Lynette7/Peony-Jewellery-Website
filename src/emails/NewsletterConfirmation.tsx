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

interface NewsletterConfirmationProps {
  email: string;
}

export default function NewsletterConfirmation({ email }: NewsletterConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the list! Welcome to the Peony HQ inner circle 🌸</Preview>
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
            <Text style={pinkBadge}>You&apos;re in! 🌸</Text>
            <Heading style={h1}>Welcome to the Peony Inner Circle</Heading>
            <Text style={heroText}>
              Hey there! Thanks for subscribing to the Peony HQ Kenya newsletter.
              You&apos;re now the first to know about:
            </Text>
          </Section>

          {/* Perks */}
          <Section style={sectionPadding}>
            <Section style={perkCard}>
              <Text style={perkText}>✨ <strong>New arrivals</strong> — before anyone else sees them</Text>
            </Section>
            <Section style={perkCard}>
              <Text style={perkText}>🏷️ <strong>Exclusive deals</strong> — subscriber-only discounts and flash sales</Text>
            </Section>
            <Section style={perkCard}>
              <Text style={perkText}>💌 <strong>Styling tips</strong> — how to style your pieces for any occasion</Text>
            </Section>
            <Section style={perkCard}>
              <Text style={perkText}>🎁 <strong>Giveaways</strong> — subscriber-exclusive contests</Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ ...sectionPadding, textAlign: 'center' }}>
            <Text style={ctaLabel}>Ready to explore?</Text>
            <Link href={`${SITE_URL}/shop`} style={ctaButton}>
              Shop the Collection
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              You&apos;re receiving this because{' '}
              <strong>{email}</strong> subscribed at peonyhq.co.ke.
            </Text>
            <Text style={footerText}>
              To unsubscribe, reply to this email with &quot;Unsubscribe&quot;.
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

const pinkBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#f8dae2',
  color: '#82001a',
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

const heroText: React.CSSProperties = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 8px',
};

const sectionPadding: React.CSSProperties = {
  padding: '16px 32px 24px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const perkCard: React.CSSProperties = {
  backgroundColor: '#fcfbf9',
  border: '1px solid #f8dae2',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '10px',
};

const perkText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const ctaLabel: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 12px',
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
