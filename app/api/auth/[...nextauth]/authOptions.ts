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
      async session({ session, token, user }) {
        console.log("Session Callback Called");
          session.accessToken = token.accessToken;
          session.user.accessToken = token.accessToken;
          // console.log("Token from session callback: ");
          // console.log(token);
          //console.log("Session: ");
          //console.log(session)
          return session;
      },

      async jwt({ token, account }){
        console.log("JWT Callback Called");
          if (account){
              token.accessToken = account.access_token
          //console.log("access token: " + token.accessToken);
          }
          //console.log(token);
          return token;
      }
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}
export default NextAuth(options);