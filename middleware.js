import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define public and private routes
  const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot", "/reset-password"];
  const PRIVATE_ROUTES = ['/chat',"/dashboard", "/profile"];
  const API_PUBLIC_ROUTES = ["/api/public"]; // Define any public API endpoints
  const API_PROTECTED_PREFIX = "/api/protected"; // Protected API routes
  const API_AUTH_PREFIX = "/api/auth"; // NextAuth API routes

  // Allow NextAuth.js API routes to be accessed freely
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // Get user token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Handle API route protection
  if (pathname.startsWith(API_PROTECTED_PREFIX) && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If it's a public API route, allow access
  if (API_PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the route is private (requires authentication)
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  // Check if the route is public (accessible without authentication)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Redirect unauthenticated users trying to access private routes
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users trying to access public routes (e.g., login/signup)
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow the request to proceed if no conditions are met
  return NextResponse.next();
}

// Define routes that should trigger the middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Apply middleware to all routes except Next.js assets
  ],
};
