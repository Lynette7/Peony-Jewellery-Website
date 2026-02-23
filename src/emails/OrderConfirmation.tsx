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
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { SITE_URL, EMAIL_LOGO_URL } from '@/lib/email';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string | null;
}

interface OrderConfirmationProps {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  city: string;
}

const formatPrice = (n: number) => `KES ${n.toLocaleString()}`;

export default function OrderConfirmation({
  customerName,
  orderId,
  items,
  subtotal,
  shipping,
  total,
  paymentMethod,
  deliveryAddress,
  city,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Peony HQ order #{orderId} is confirmed 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={EMAIL_LOGO_URL}
              alt="Peony HQ Kenya"
              width={120}
              height={40}
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Section>

          {/* Hero text */}
          <Section style={heroSection}>
            <Heading style={h1}>Order Confirmed! 🌸</Heading>
            <Text style={heroText}>
              Hi {customerName}, thank you for your order. We&apos;re getting your pieces
              ready and will be in touch soon.
            </Text>
            <Text style={orderIdText}>Order #{orderId}</Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Your Items</Heading>
            {items.map((item) => (
              <Row key={`${item.id}-${item.variant ?? ''}`} style={itemRow}>
                <Column style={itemImageCol}>
                  <Img
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    style={itemImage}
                  />
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  {item.variant && (
                    <Text style={itemVariant}>{item.variant}</Text>
                  )}
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={sectionPadding}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column style={totalValueCol}>
                <Text style={totalValue}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Shipping</Text>
              </Column>
              <Column style={totalValueCol}>
                <Text style={totalValue}>{formatPrice(shipping)}</Text>
              </Column>
            </Row>
            <Hr style={{ ...divider, margin: '8px 0' }} />
            <Row style={totalRow}>
              <Column>
                <Text style={{ ...totalLabel, fontWeight: '700', fontSize: '16px' }}>
                  Total
                </Text>
              </Column>
              <Column style={totalValueCol}>
                <Text style={{ ...totalValue, color: '#82001a', fontWeight: '700', fontSize: '18px' }}>
                  {formatPrice(total)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Delivery & Payment details */}
          <Section style={sectionPadding}>
            <Row>
              <Column style={{ width: '50%', paddingRight: '16px' }}>
                <Heading style={h3}>Delivery Address</Heading>
                <Text style={detailText}>
                  {deliveryAddress}
                  <br />
                  {city}
                </Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Heading style={h3}>Payment Method</Heading>
                <Text style={detailText}>
                  {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card Payment'}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ ...sectionPadding, textAlign: 'center' }}>
            <Text style={ctaText}>
              Questions about your order? We&apos;re happy to help.
            </Text>
            <Link href={`https://wa.me/+254111887020`} style={ctaButton}>
              Chat on WhatsApp
            </Link>
            <Text style={footerTextSmall}>
              or email us at{' '}
              <Link href="mailto:hello@peonyhq.co.ke" style={link}>
                hello@peonyhq.co.ke
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Peony HQ Kenya. All rights reserved.
            </Text>
            <Text style={footerText}>
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
  padding: '32px 32px 24px',
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
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const orderIdText: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  fontFamily: 'monospace',
};

const h2: React.CSSProperties = {
  color: '#000',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const h3: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const sectionPadding: React.CSSProperties = {
  padding: '24px 32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const itemRow: React.CSSProperties = {
  marginBottom: '16px',
};

const itemImageCol: React.CSSProperties = {
  width: '80px',
  verticalAlign: 'middle',
};

const itemImage: React.CSSProperties = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const itemDetailsCol: React.CSSProperties = {
  paddingLeft: '12px',
  verticalAlign: 'middle',
};

const itemName: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 2px',
};

const itemVariant: React.CSSProperties = {
  color: '#82001a',
  fontSize: '12px',
  margin: '0 0 2px',
};

const itemQty: React.CSSProperties = {
  color: '#888',
  fontSize: '12px',
  margin: '0',
};

const itemPriceCol: React.CSSProperties = {
  textAlign: 'right',
  verticalAlign: 'middle',
  width: '100px',
};

const itemPrice: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const totalRow: React.CSSProperties = {
  marginBottom: '6px',
};

const totalLabel: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const totalValueCol: React.CSSProperties = {
  textAlign: 'right',
};

const totalValue: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const detailText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const ctaText: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 16px',
};

const ctaButton: React.CSSProperties = {
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
  margin: '0 0 4px',
};
