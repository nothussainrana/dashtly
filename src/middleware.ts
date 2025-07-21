import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Routes that should be excluded from authentication middleware
const PUBLIC_ROUTES = [
  'api',
  '_next/static',
  '_next/image',
  'favicon.ico',
  'sitemap.xml',
  'robots.txt',
  'public',
  'login',
  'register',
  'verify-email',
  'resend-verification',
  'forgot-password',
  'reset-password',
];

export const config = {
  matcher: [
    // Apply middleware to all routes except public routes and the root path
    `/((?!${PUBLIC_ROUTES.join('|')}|$).*)`,
  ],
}; 