import { NextRequest, NextResponse } from "next/server";

// const PUBLIC_ROUTES = ["/signin", "/signup", "/forgot-password"];
const AUTH_ROUTES = ["/signin", "/signup"];
const DASHBOARD_ROUTE = "/dashboard";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow next internals, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ✅ Read token from Authorization header first
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // ✅ Fallback to cookies if available
  const cookieToken = req.cookies.get("token")?.value || null;
  const token = bearerToken || cookieToken;

  // ✅ Read role from header first, then cookie
  const headerRole = req.headers.get("x-user-role");
  const cookieRole = req.cookies.get("role")?.value || null;
  const role = headerRole || cookieRole;

//   const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isTenantAdminRoute = pathname.startsWith("/tenant");

  // ======================================================
  // 🚫 Not logged in → block protected routes
  // ======================================================
  if (!token && (isDashboardRoute || isAdminRoute || isTenantAdminRoute)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // ======================================================
  // ✅ Already logged in → prevent going back to auth pages
  // ======================================================
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.url));
  }

  // ======================================================
  // 🔐 ADMIN only
  // ======================================================
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ======================================================
  // 🔐 TENANT ADMIN only
  // ======================================================
  if (isTenantAdminRoute && role !== "TENANT_ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};