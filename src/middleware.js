import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('userToken')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register', '/forget-password', '/verify-code', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 1. If trying to access protected route without token
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access Login/Register while already logged in
  if (token && isPublicRoute) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Exclusion list
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|logo.svg).*)'],
};