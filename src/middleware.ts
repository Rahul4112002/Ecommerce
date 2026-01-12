import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    
    // Check if trying to access admin routes
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to non-admin routes if logged in
        if (!req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        // For admin routes, check if user is admin
        return token?.role === "ADMIN";
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};
