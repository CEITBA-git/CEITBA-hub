import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/lib/env';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "online",
          prompt: "select_account",
          hd: "itba.edu.ar"
        }
      }
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  debug: env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email?.endsWith("@itba.edu.ar") ?? false;
      }
      return false;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.email = profile?.email;
      }
      return token;
    }
  },
  pages: {
    signIn: '/minecraft',
    error: '/minecraft'
  }
}; 