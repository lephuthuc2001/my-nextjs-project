import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ date: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { date } = parsedCredentials.data;
          // Verify the date credential
          if (date === '29-06-2025') {
            return { id: '1', name: 'User', email: 'user@example.com' };
          }
        }
        
        return null;
      },
    }),
  ],
});
