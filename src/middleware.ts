import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login (login page)
     * - register (registration page)
     * - verify-email (email verification page)
     * - resend-verification (resend verification page)
     * - root path (homepage)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|login|register|verify-email|resend-verification|$).*)",
  ],
}; 