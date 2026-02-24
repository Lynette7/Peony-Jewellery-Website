import { NextRequest, NextResponse } from 'next/server';
import { MPESA_BASE_URL, getMpesaAccessToken, getMpesaPassword, getMpesaTimestamp } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, orderId } = await req.json();

    const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
    const tillNumber = process.env.MPESA_TILL_NUMBER;
    const isTill = !!tillNumber;
    const timestamp = getMpesaTimestamp();
    const password = getMpesaPassword(timestamp);
    const accessToken = await getMpesaAccessToken();

    const body = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: isTill ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: phoneNumber,
      PartyB: isTill ? tillNumber : shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL!,
      AccountReference: `PEONY-${orderId || 'ORDER'}`,
      TransactionDesc: 'Peony HQ Order Payment',
    };

    console.log('STK Push request body:', JSON.stringify(body, null, 2));
    const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('Safaricom STK Push response:', JSON.stringify(data, null, 2));

    if (data.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
      });
    }

    return NextResponse.json(
      { success: false, error: data.errorMessage || data.ResultDesc || 'STK push failed', raw: data },
      { status: 400 }
    );
  } catch (error) {
    console.error('STK Push error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
