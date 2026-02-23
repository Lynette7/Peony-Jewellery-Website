import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string | null;
}

interface AdminOrderNotificationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  city: string;
  createdAt?: string;
}

const formatPrice = (n: number) => `KES ${n.toLocaleString()}`;

export default function AdminOrderNotification({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  items,
  total,
  paymentMethod,
  deliveryAddress,
  city,
  createdAt,
}: AdminOrderNotificationProps) {
  const orderTime = createdAt
    ? new Date(createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
    : new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });

  return (
    <Html>
      <Head />
      <Preview>🛍️ New order #{orderId} — {customerName} — {formatPrice(total)}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>🛍️ New Order Received</Text>
            <Text style={headerSub}>Order #{orderId} · {orderTime}</Text>
          </Section>

          {/* Customer info */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Customer Details</Heading>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Name</Text></Column>
              <Column><Text style={value}>{customerName}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Email</Text></Column>
              <Column>
                <Text style={value}>
                  <Link href={`mailto:${customerEmail}`} style={link}>{customerEmail}</Link>
                </Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Phone</Text></Column>
              <Column>
                <Text style={value}>
                  <Link href={`https://wa.me/${customerPhone.replace(/\D/g, '')}`} style={link}>
                    {customerPhone}
                  </Link>
                </Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Address</Text></Column>
              <Column><Text style={value}>{deliveryAddress}, {city}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Payment</Text></Column>
              <Column>
                <Text style={value}>
                  {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card Payment'}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={sectionPadding}>
            <Heading style={h2}>Items Ordered</Heading>
            {items.map((item) => (
              <Row key={`${item.id}-${item.variant ?? ''}`} style={itemRow}>
                <Column style={{ flex: 1 }}>
                  <Text style={itemName}>{item.name}</Text>
                  {item.variant && <Text style={itemVariant}>Variant: {item.variant}</Text>}
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Total */}
          <Section style={sectionPadding}>
            <Row>
              <Column>
                <Text style={{ ...label, fontSize: '16px', fontWeight: '700' }}>Order Total</Text>
              </Column>
              <Column style={itemPriceCol}>
                <Text style={{ ...itemPrice, fontSize: '20px', color: '#82001a' }}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Quick actions */}
          <Section style={{ ...sectionPadding, backgroundColor: '#f8dae2', borderRadius: '8px', margin: '0 24px 24px' }}>
            <Text style={{ ...label, marginBottom: '8px' }}>Quick Actions</Text>
            <Text style={actionText}>
              <Link
                href={`https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customerName)}%2C%20this%20is%20Peony%20HQ%20confirming%20your%20order%20%23${orderId}.%20We%27ll%20be%20in%20touch%20shortly!`}
                style={link}
              >
                📱 WhatsApp {customerName}
              </Link>
              {'  ·  '}
              <Link href={`mailto:${customerEmail}`} style={link}>
                ✉️ Email {customerName}
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
  backgroundColor: '#f0f0f0',
  fontFamily: 'Arial, sans-serif',
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
  padding: '20px 32px',
};

const headerTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const headerSub: React.CSSProperties = {
  color: '#f8dae2',
  fontSize: '13px',
  margin: '0',
};

const h2: React.CSSProperties = {
  color: '#000',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const sectionPadding: React.CSSProperties = {
  padding: '20px 32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const infoRow: React.CSSProperties = {
  marginBottom: '8px',
};

const labelCol: React.CSSProperties = {
  width: '100px',
};

const label: React.CSSProperties = {
  color: '#888',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  margin: '0',
};

const value: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  margin: '0',
};

const itemRow: React.CSSProperties = {
  paddingBottom: '12px',
  marginBottom: '12px',
  borderBottom: '1px solid #f0f0f0',
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
  width: '120px',
};

const itemPrice: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const link: React.CSSProperties = {
  color: '#82001a',
  textDecoration: 'underline',
};

const actionText: React.CSSProperties = {
  color: '#444',
  fontSize: '14px',
  margin: '0',
};
