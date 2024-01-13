/**
 * Public Routes that everyone can visit
 * @types[string]
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * Authentication routes that user use to authenticate
 * they navigate user to settings page after authentication complete
 * @types[string]
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-reset",
];

/**
 * The prefixes to api authentication route
 * api that are start with these prefixes are used for api authentication
 * @types string
 */

export const apiAuthPrefixes = "/api/auth";

/**
 * The default redirect path after logged in
 * @types string
 */
export const DEFAULT_REDIRECT_PATH = "/settings";
