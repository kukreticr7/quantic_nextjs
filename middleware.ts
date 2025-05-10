import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");


    if (isApiRoute) {

      if (req.method === "GET" && req.nextUrl.pathname.startsWith("/api/todos")) {
        return NextResponse.next();
      }


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
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/todos/:path*", "/api/todos/:path*"],
};