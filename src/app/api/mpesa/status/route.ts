import { NextRequest, NextResponse } from 'next/server';
import { MPESA_BASE_URL, getMpesaAccessToken, getMpesaPassword, getMpesaTimestamp } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId } = await req.json();

    const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
    const timestamp = getMpesaTimestamp();
    const password = getMpesaPassword(timestamp);
    const accessToken = await getMpesaAccessToken();

    const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const data = await res.json();
    console.log('Safaricom status response:', JSON.stringify(data, null, 2));

    // Safaricom rate-limit response — treat as still pending
    if (data.fault) {
      return NextResponse.json({ ResultCode: '4999', ResultDesc: 'Rate limited, retrying...' });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
