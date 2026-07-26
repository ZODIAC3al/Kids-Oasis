import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/booking',
  '/enrollment',
  '/onboarding',
  '/chat'
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname (e.g. /en/dashboard -> locale = en, path = /dashboard)
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] === 'ar' || segments[0] === 'en' ? segments[0] : 'en';
  const pathWithoutLocale = segments[0] === 'ar' || segments[0] === 'en'
    ? '/' + segments.slice(1).join('/')
    : pathname;

  const isProtected = protectedRoutes.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  // Check for authentication token in cookies
  const hasToken = request.cookies.has('refreshToken') || request.cookies.has('authToken');

  if (isProtected && !hasToken) {
    // If accessing protected route without auth cookie, check headers or let request pass with locale
    // allow intlMiddleware to handle locale redirect first, then client-side Redux state will redirect to /login
  }

  // Execute next-intl middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
