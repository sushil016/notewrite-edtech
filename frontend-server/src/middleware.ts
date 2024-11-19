import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath = path === '/login' || 
                      path === '/signup' || 
                      path === '/verify-otp' || 
                      path === '/forgot-password' ||
                      path === '/' ||  // Add home page as public
                      path === '/courses' || // Add courses page as public
                      path.startsWith('/courses/'); // Allow course preview pages

  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Allow OTP verification without token
  if (path === '/verify-otp') {
    return NextResponse.next();
  }

  // Only redirect authenticated users from auth pages
  if (isPublicPath && token && (
    path === '/login' || 
    path === '/signup' || 
    path === '/verify-otp' || 
    path === '/forgot-password'
  )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Only check authentication for protected paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/courses/:path*',
    '/dashboard/:path*',
    '/teacher/:path*',
    '/admin/:path*',
  ]
}; 