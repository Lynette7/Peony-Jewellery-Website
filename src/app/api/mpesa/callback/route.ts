import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid callback' });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID } = callback;

    if (ResultCode === 0) {
      const metadata: { Name: string; Value: string | number }[] =
        callback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = metadata.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = metadata.find((i) => i.Name === 'PhoneNumber')?.Value;
      const amount = metadata.find((i) => i.Name === 'Amount')?.Value;

      console.log('M-Pesa payment success:', {
        CheckoutRequestID,
        mpesaReceiptNumber,
        phoneNumber,
        amount,
      });

      // TODO: update order status in DB using CheckoutRequestID when you add that column
    } else {
      console.log('M-Pesa payment failed:', { CheckoutRequestID, ResultDesc });
    }

    // Always respond with success so Safaricom stops retrying
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
