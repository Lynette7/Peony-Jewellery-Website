import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

// Paystack sends this header to prove the request is from them
function verifySignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature') ?? '';

  if (!verifySignature(rawBody, signature)) {
    console.error('[Paystack webhook] Invalid signature — request rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;

    console.log(`[Paystack webhook] Payment confirmed — ref: ${reference}, amount: ${amount / 100} KES, email: ${customer.email}`);

    // Update order status to 'processing' if the order was already created
    // (order is created client-side on popup success; this handles edge cases
    //  where the client callback fired but order creation failed, or the user
    //  closed the browser before the order was saved)
    const supabase = await createClient();
    const { data: order } = await supabase
      .from('orders')
      .select('id, status')
      .eq('paystack_reference', reference)
      .maybeSingle();

    if (order) {
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', order.id);

      console.log(`[Paystack webhook] Order ${order.id} updated to processing`);
    } else {
      // Order doesn't exist yet — log for manual review
      // This can happen if the client-side order creation failed
      console.warn(`[Paystack webhook] No order found for ref ${reference} — may need manual review`);
    }
  }

  return NextResponse.json({ received: true });
}
