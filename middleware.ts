// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are protected
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Check if the requested route is protected
    if (isProtectedRoute(req)) {
      console.log("Protected route accessed:", req.url); // Debug log
      await auth.protect();
    }
  } catch (error) {
    console.error("Error in Clerk middleware:", error.message);
    throw error; // Allow Clerk to handle the error properly
  }
});

// Middleware configuration for matching routes
export const config = {
  matcher: [
    "/dashboard/:path*",        // Protect all subpaths under /dashboard
    "/((?!.*\\..*|_next).*)",   // Apply middleware to other non-static routes
    "/",                        // Root route
  ],
};
