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

interface WelcomeEmailProps {
  firstName: string;
  email: string;
}

export default function WelcomeEmail({ firstName, email }: WelcomeEmailProps) {
  const displayName = firstName || email.split('@')[0];

  return (
    <Html>
      <Head />
      <Preview>Welcome to Peony HQ Kenya — your jewellery journey starts here 🌸</Preview>
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
            <Heading style={h1}>Welcome to Peony HQ, {displayName}! 🌸</Heading>
            <Text style={heroText}>
              We&apos;re so glad you&apos;re here. Your account is ready and you now have
              access to your personal wishlist, order history, and exclusive member perks.
            </Text>
          </Section>

          {/* Email confirmation notice */}
          <Section style={confirmationBannerWrapper}>
            <Section style={confirmationBanner}>
              <Text style={confirmationText}>
                📬 <strong>One more step:</strong> Check your inbox for a confirmation email
                from <strong>Supabase</strong> and click the link inside to verify your email
                address. Can&apos;t find it? Check your spam or junk folder.
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* What's next */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Here&apos;s what you can do now</Heading>

            <Section style={featureItem}>
              <Text style={featureIcon}>🛍️</Text>
              <Text style={featureText}>
                <strong>Browse the collection</strong> — explore earrings, necklaces,
                rings, bracelets and sets, all handpicked just for you.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureIcon}>❤️</Text>
              <Text style={featureText}>
                <strong>Save your favourites</strong> — add pieces to your wishlist
                so you never lose track of what you love.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureIcon}>📦</Text>
              <Text style={featureText}>
                <strong>Track your orders</strong> — visit your account page anytime
                to see your order history and status.
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ ...sectionPadding, textAlign: 'center' }}>
            <Link href={`${SITE_URL}/shop`} style={ctaButton}>
              Shop the Collection
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions? Chat with us on{' '}
              <Link href="https://wa.me/+254111887020" style={link}>
                WhatsApp
              </Link>{' '}
              or email{' '}
              <Link href="mailto:peonyhqkenya@gmail.com" style={link}>
                peonyhqkenya@gmail.com
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
  padding: '36px 32px 24px',
  textAlign: 'center',
};

const h1: React.CSSProperties = {
  color: '#82001a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const heroText: React.CSSProperties = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0',
};

const confirmationBannerWrapper: React.CSSProperties = {
  padding: '0 32px 8px',
};

const confirmationBanner: React.CSSProperties = {
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: '8px',
  padding: '16px 20px',
};

const confirmationText: React.CSSProperties = {
  color: '#5d4037',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const h2: React.CSSProperties = {
  color: '#000',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const sectionPadding: React.CSSProperties = {
  padding: '28px 32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const featureItem: React.CSSProperties = {
  display: 'flex',
  marginBottom: '16px',
  padding: '16px',
  backgroundColor: '#fcfbf9',
  borderRadius: '8px',
  border: '1px solid #f8dae2',
};

const featureIcon: React.CSSProperties = {
  fontSize: '20px',
  margin: '0 12px 0 0',
  lineHeight: '1',
};

const featureText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
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
  margin: '0 0 6px',
};
