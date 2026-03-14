import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { reference } = await req.json();

  if (!reference) {
    return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await res.json();

  if (!data.status || data.data?.status !== 'success') {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: data.data });
}
