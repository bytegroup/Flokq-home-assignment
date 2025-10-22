export { default } from 'next-auth/middleware';

// Protect dashboard routes
export const config = {
    matcher: ['/dashboard/:path*'],
};