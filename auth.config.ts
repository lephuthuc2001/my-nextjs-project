import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // In this specific app, the home page '/' handles both login and main content.
      // We don't strictly enforce redirects here because '/' is the entry point.
      // However, if we had a '/login' page, we would redirect.
      // For now, we return true to allow access, and let the page logic handle display.
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
