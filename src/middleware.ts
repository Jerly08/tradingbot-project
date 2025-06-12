import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next();

  // Define CSP Header
  const cspHeader = 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.binancefuture.com https://*.mongodb.net https://vercel.live; " +
    "worker-src 'self' blob:;";

  // Set CSP header
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 