// app/api/getUserExists.js
import clientPromise from '../../utils/mongodb'; // Adjust the path to your MongoDB connection utility
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const req = new NextRequest(request);
  try {
    // Extract query parameters
    const url = new URL(req.url);
    const discordServerId = url.searchParams.get('discordServerId');
    const discordUserId = url.searchParams.get('discordUserId');

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); 
    const collection = db.collection('users');

    // Check if the user exists
    const userExists = await collection.findOne({ 
      discordServerId, 
      discordUserId 
    });

    // Return true if the user exists, false otherwise
    return new Response(JSON.stringify({ exists: !!userExists }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database query error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
