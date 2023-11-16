import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req });
    if (!jwt) {
      return new NextResponse(JSON.stringify({ error: "You must be signed in" }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const accessToken = jwt.accessToken;
    const discordResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {revalidate: 3600}
    });

    if (!discordResponse.ok) {
      // Handle errors from Discord's API
      const errorInfo = await discordResponse.json();
      return new NextResponse(JSON.stringify({ error: errorInfo }), {
        status: discordResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const guilds = await discordResponse.json();
    const ownedGuilds = guilds.filter(guild => guild.owner);
    //console.log(JSON.stringify({ ownedGuilds }));
    return new NextResponse(JSON.stringify(ownedGuilds), {
        status: 200, // Set your desired status code
      });
  } catch (error) {
    console.error('Error fetching owned guilds:', error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
