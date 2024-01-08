import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'

import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
var scopes = ['identify', 'guilds'];
export const options: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            authorization: { params: { scope: 'identify guilds' } },
        }),
    ],
    callbacks: {
      async session({ session, token }) {
        // Attach only necessary user information to the session
        // Do not attach the access token
        session.user = token?.user as any;
        return session;
      },

      async jwt({ token, account }){
        if (account){
          token.accessToken = account.access_token;
        }
        return token;
      }
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}
export default NextAuth(options);