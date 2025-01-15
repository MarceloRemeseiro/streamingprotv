import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin")

    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/player/:path*"]
} 