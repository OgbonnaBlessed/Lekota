// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes and required roles
const protectedRoutes = [
  { path: "/dashboard", role: null }, // any logged-in user
  { path: "/admin", role: "admin" }, // only ADMIN
];

export function middleware(req: NextRequest) {
  // Read token from Authorization header
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  const url = req.nextUrl.clone();

  // Check routes
  for (const route of protectedRoutes) {
    if (req.nextUrl.pathname.startsWith(route.path)) {
      // If token is missing, redirect to signin
      if (!token) {
        url.pathname = "/signin";
        return NextResponse.redirect(url);
      }

      // If route requires a specific role, verify it
      if (route.role) {
        // Example: decode role from JWT (pseudo)
        // In real projects, use jwt.decode(token) here
        const roleFromToken = req.headers.get("x-role") || "";
        if (roleFromToken !== route.role) {
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

// Apply middleware only to these paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
