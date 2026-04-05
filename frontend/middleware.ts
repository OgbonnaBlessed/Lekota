/* eslint-disable @typescript-eslint/no-explicit-any */
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: any) {
  const token = req.cookies.get("token");
  const role = req.cookies.get("role")?.value;

  const url = req.nextUrl.pathname;

  if (!token && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (url.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
