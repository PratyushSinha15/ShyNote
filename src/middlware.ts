import { NextRequest, NextResponse } from 'next/server';
import nextAuthMiddleware from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';

// Middleware function to handle authentication
export async function middleware(request: NextRequest) {
  // Optionally check for JWT token and redirect based on authentication
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url= request.nextUrl;

  if (token && (url.pathname.startsWith('/sign-in') || 
                url.pathname.startsWith('/sign-up') ||
                url.pathname.startsWith('/verify')  ||
                url.pathname.startsWith('/'))) {
    // If authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

  // If authenticated, let the request proceed
  return NextResponse.next();
}

// Define the paths for which this middleware should run
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
};
