import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('userToken')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register', '/forget-password', '/verify-code', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 1. If trying to access protected route without token (Keep this)
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. ONLY redirect logged-in users away from Login and Register
  const authRoutes = ['/login', '/register']; 
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude List
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|logo.svg).*)'],
};