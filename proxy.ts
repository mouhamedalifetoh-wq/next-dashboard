import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  // favicon.ico is excluded too (not in the course): otherwise the authorized callback
  // redirects a signed-in user's favicon request to /dashboard and the icon breaks.
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
};
