import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware function that handles authentication and authorization
 * Protects routes and API endpoints based on user roles
 */
export default withAuth(
  function middleware(req) {
    // Get user token and check if user is admin
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    // Handle API route access
    if (isApiRoute) {
      // Allow GET requests to todos API for all authenticated users
      if (req.method === "GET" && req.nextUrl.pathname.startsWith("/api/todos")) {
        return NextResponse.next();
      }

      // Restrict write operations (POST, PUT, DELETE, PATCH) to admin users only
      if (
        (req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "DELETE" ||
          req.method === "PATCH") &&
        req.nextUrl.pathname.startsWith("/api/todos")
      ) {
        if (!isAdmin) {
          return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            {
              status: 403,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    }

    return NextResponse.next();
  },
  {
    // Ensure user is authenticated for all protected routes
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configure which routes should be protected by this middleware
export const config = {
  matcher: ["/todos/:path*", "/api/todos/:path*"],
};