import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyUnsubscribeToken } from '@/lib/newsletter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?status=error', request.url),
    );
  }

  // Verify HMAC token
  try {
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribe?status=error', request.url),
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?status=error', request.url),
    );
  }

  // Deactivate the subscriber
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: false })
    .eq('email', email.toLowerCase().trim());

  if (error) {
    console.error('[Unsubscribe] DB error:', error);
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?status=error', request.url),
    );
  }

  return NextResponse.redirect(
    new URL('/newsletter/unsubscribe?status=success', request.url),
  );
}
