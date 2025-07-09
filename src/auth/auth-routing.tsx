import { AuthRoutes } from './auth-routes';

/**
 * Handles all authentication related routes.
 * This component is mounted at /auth/* in the main application router.
 */
export function AuthRouting() {
  return <AuthRoutes />;
}
