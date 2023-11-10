// pages/api/checkServerStatus.js

import { NextRequest, NextResponse } from 'next/server';
import { getGuilds } from '../../utils/discord'; // Assumes getGuilds uses the user's OAuth2 token
import clientPromise from '../../utils/mongodb';

export async function GET(request: NextRequest) {
  // Parse the URL to get query parameters
  const url = new URL(request.url);
  const serverId = url.searchParams.get('serverId');
  const accessToken = url.searchParams.get('accessToken');

  if (!serverId || !accessToken) {
    return new Response(JSON.stringify({ error: 'Server ID and access token are required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Check if the server is in the "Moderated Servers" collection
    const client = await clientPromise;
    const db = client.db('Discord_Bot');
    const collection = db.collection('Moderated Servers');
    const moderatedServer = await collection.findOne({ discordServerId:serverId });
    const isModerated = !!moderatedServer;

    // Fetch the list of guilds the user is a part of and check ownership
    const guilds = await getGuilds(accessToken);
    const isOwner = guilds.some(guild => guild.id === serverId && guild.owner);

    // Respond with the moderation status and ownership
    return new Response(JSON.stringify({ isModerated, isOwner }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to check server status' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
