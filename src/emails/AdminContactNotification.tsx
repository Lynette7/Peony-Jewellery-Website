import {
  Body,
  Container,
  Head,
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

interface AdminContactNotificationProps {
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  subject: string;
  message: string;
  receivedAt?: string;
}

export default function AdminContactNotification({
  senderName,
  senderEmail,
  senderPhone,
  subject,
  message,
  receivedAt,
}: AdminContactNotificationProps) {
  const timeStr = receivedAt
    ? new Date(receivedAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
    : new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });

  return (
    <Html>
      <Head />
      <Preview>💌 New contact message from {senderName} — &quot;{subject}&quot;</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>💌 New Contact Message</Text>
            <Text style={headerSub}>{timeStr}</Text>
          </Section>

          {/* Sender info */}
          <Section style={sectionPadding}>
            <Text style={sectionTitle}>From</Text>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Name</Text></Column>
              <Column><Text style={value}>{senderName}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Email</Text></Column>
              <Column>
                <Text style={value}>
                  <Link href={`mailto:${senderEmail}`} style={link}>{senderEmail}</Link>
                </Text>
              </Column>
            </Row>
            {senderPhone && (
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={label}>Phone</Text></Column>
                <Column>
                  <Text style={value}>
                    <Link
                      href={`https://wa.me/${senderPhone.replace(/\D/g, '')}`}
                      style={link}
                    >
                      {senderPhone}
                    </Link>
                  </Text>
                </Column>
              </Row>
            )}
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Subject</Text></Column>
              <Column><Text style={{ ...value, fontWeight: '700' }}>{subject}</Text></Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Message body */}
          <Section style={sectionPadding}>
            <Text style={sectionTitle}>Message</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Quick reply */}
          <Section style={actionSection}>
            <Text style={actionLabel}>Reply quickly:</Text>
            <Link href={`mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}`} style={actionButton}>
              ✉️ Reply by Email
            </Link>
            {senderPhone && (
              <Link
                href={`https://wa.me/${senderPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(senderName.split(' ')[0])}%2C%20thanks%20for%20reaching%20out%20to%20Peony%20HQ!%20`}
                style={{ ...actionButton, backgroundColor: '#25D366', marginLeft: '12px' }}
              >
                📱 WhatsApp
              </Link>
            )}
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

const sectionPadding: React.CSSProperties = {
  padding: '20px 32px',
};

const sectionTitle: React.CSSProperties = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: '0 0 12px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const infoRow: React.CSSProperties = {
  marginBottom: '8px',
};

const labelCol: React.CSSProperties = {
  width: '80px',
};

const label: React.CSSProperties = {
  color: '#888',
  fontSize: '12px',
  margin: '0',
};

const value: React.CSSProperties = {
  color: '#000',
  fontSize: '14px',
  margin: '0',
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

const actionSection: React.CSSProperties = {
  backgroundColor: '#f8dae2',
  padding: '16px 32px',
};

const actionLabel: React.CSSProperties = {
  color: '#82001a',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  margin: '0 0 8px',
};

const actionButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#82001a',
  color: '#ffffff',
  padding: '8px 18px',
  borderRadius: '999px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '13px',
};

const link: React.CSSProperties = {
  color: '#82001a',
  textDecoration: 'underline',
};
