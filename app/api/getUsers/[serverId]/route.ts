// app/api/getUserExists.js
import clientPromise from '../../../utils/mongodb'; // Adjust the path to your MongoDB connection utility
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: {params: {serverId: string}}) {
  try {
    // Extract query parameters
    const serverId = params.serverId;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); 
    const collection = db.collection('users');

    // Check if the user exists
    const users = await collection.find({ 
      discordServerId: serverId, 
    }).toArray();
    const authUsers = users.filter(user => user.userAuthStatus === 'authenticated');
    const approvUsers = users.filter(user => user.userAuthStatus === 'approved');
    const retUsers = {
        authenticated: authUsers,
        approved: approvUsers
    }

    // Return true if the user exists, false otherwise
    return new NextResponse(JSON.stringify(retUsers), {
        status: 200, // Set your desired status code
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
