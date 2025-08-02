import { clerkMiddleware } from '@clerk/nextjs/server';
// import { authMiddleware } from '@clerk/nextjs';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!_next/image|_next/static|favicon.ico).*)'],
};
