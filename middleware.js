import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin protected routes
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password';

  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/api');

  const accessToken = request.cookies.get('admin_access_token')?.value;
  const refreshToken = request.cookies.get('admin_refresh_token')?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // If user is on an auth page but already logged in, redirect to dashboard
  if (isAuthPage && isAuthenticated) {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is trying to access protected admin routes without token
  if (isAdminRoute && !isAuthPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
