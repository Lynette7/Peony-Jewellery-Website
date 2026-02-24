export const MPESA_BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

export function getMpesaTimestamp(): string {
  return new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
}

export function getMpesaPassword(timestamp: string): string {
  const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  return Buffer.from(shortCode + passkey + timestamp).toString('base64');
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getMpesaAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  const text = await res.text();
  let data: { access_token: string; expires_in: string };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Safaricom OAuth returned non-JSON: ${text.slice(0, 200)}`);
  }

  console.log('Safaricom OAuth response:', JSON.stringify(data, null, 2));
  cachedToken = data.access_token;
  // Expire 60s early to avoid using a token right as it expires
  tokenExpiresAt = Date.now() + (parseInt(data.expires_in) - 60) * 1000;
  return cachedToken;
}
