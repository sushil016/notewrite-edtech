import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath = [
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/',
  ].includes(path) 
  
  // Define auth pages
  const isAuthPage = ['/login', '/signup', '/verify-otp', '/forgot-password'].includes(path);

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  const protectedRoutes = ['/dashboard', '/teacher', '/admin'];


  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  // If user is logged in and trying to access auth pages
  // if (token && isAuthPage) {
  //   const redirectUrl = request.cookies.get('redirectUrl')?.value || '/';
  //   return NextResponse.redirect(new URL(redirectUrl, request.url));
  // }

  // If user is not logged in and trying to access protected routes
  if (!token && !isPublicPath) {
    // Store the attempted URL
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('redirectUrl', path);
    return response;
  }

  return NextResponse.next();
}

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