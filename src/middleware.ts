import { withAuth } from "next-auth/middleware";

// Routes that should be excluded from authentication middleware
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/resend-verification',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/help',
  '/privacy',
  '/terms',
  '/cookies',
  '/accessibility',
  '/blog',
  '/careers',
  '/products',
  '/search',
  '/users'
];

export default withAuth(
  function middleware(req) {
    // This function runs only for protected routes
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes without authentication
        if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // For API routes, allow some public endpoints
        if (pathname.startsWith('/api/')) {
          const publicApiRoutes = [
            '/api/auth',
            '/api/register',
            '/api/verify-email',
            '/api/resend-verification',
            '/api/forgot-password',
            '/api/reset-password',
            '/api/categories',
            '/api/products/search',
            '/api/search'
          ];
          
          if (publicApiRoutes.some(route => pathname.startsWith(route))) {
            return true;
          }
        }
        
        // Require authentication for all other routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Apply to all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}; 