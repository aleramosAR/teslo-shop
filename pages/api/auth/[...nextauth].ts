import { dbUsers } from "@/database";
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

export const authOptions:NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' }
      },
      async authorize(credentials):Promise<any> {
        console.log(credentials);
        // return { name: 'Ale', correo: 'ale@ale.com', role: 'admin' };
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    
  ],

  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  session: {
    maxAge: 2592000, // 30 dias
    strategy: 'jwt',
    updateAge: 86400, // cada dia se actualiza
  },

  // Callbacks
  callbacks: {

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },

    async session({ session, token, user }) {

      session.accessToken = token.access_token as any;
      session.user = token.user as any;

      return session;
    },

  }
}

export default NextAuth(authOptions)