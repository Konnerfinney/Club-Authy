// app/api/moderated-servers/[serverId].ts
import { NextRequest } from 'next/server';
import clientPromise from '../../../utils/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Extract serverId from the URL
    const serverId = request.nextUrl.pathname.split('/').pop();

    const client = await clientPromise;
    const db = client.db('Discord_Bot');
    const collection = db.collection('Moderated Servers');
    const server = await collection.findOne({ discordServerId: serverId });
    console.log(server);

    if (server) {
      return new Response(JSON.stringify({ isModerated: true, serverName: server.discordServerName }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ isModerated: false, serverName: "" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (e) {
    // ...error handling code
  }
}
