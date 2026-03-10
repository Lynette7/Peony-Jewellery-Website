import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Only block admin routes if env vars are missing
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    if (isAdminRoute && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session on every request — this keeps auth tokens alive
  // and prevents the progressive session degradation
  let user = null;
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error('Error getting user in proxy:', error);
  }

  // Admin route protection
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return supabaseResponse;
  }

  // Login page: redirect to admin if already authenticated
  if (request.nextUrl.pathname === '/admin/login') {
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return supabaseResponse;
  }

  // All other admin routes: require authentication
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
