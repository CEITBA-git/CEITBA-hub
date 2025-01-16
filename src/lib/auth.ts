import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "online",
          hd: "itba.edu.ar",
          scope: "openid email profile"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  pages: {
    signIn: '/minecraft',
    error: '/minecraft?error=true',
    signOut: '/minecraft'
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile?.email) {
        return '/minecraft?error=no_account';
      }
      if (account.provider === "google") {
        return profile.email.endsWith("@itba.edu.ar") || '/minecraft?error=invalid_domain';
      }
      return '/minecraft?error=invalid_provider';
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.email = profile.email;
      }
      return token;
    }
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.ceitba.org.ar' : undefined
      }
    }
  },
  debug: process.env.NODE_ENV === 'development'
}; 