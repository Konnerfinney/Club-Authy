// app/api/newServer.ts
import { NextRequest } from 'next/server';
import clientPromise from '../../utils/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body to get the server data
    const body = await request.json();
    const { discordServerId, discordServerName } = body;

    // Validate the required information
    if (!discordServerId || !discordServerName) {
      return new Response(JSON.stringify({ error: 'Missing required server information' }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Initialize the MongoDB client and connect to the database
    const client = await clientPromise;
    const db = client.db("Discord_Bot");

    // Define the document to insert
    const doc = {
      discordServerId,
      discordServerName,
      createdAt: new Date(),
    };

    // Insert the document into the "Moderated Servers" collection
    const collection = db.collection("Moderated Servers");
    const response = await collection.insertOne(doc);

    // Respond with success if the insertion was acknowledged
    if (response.acknowledged) {
      return new Response(JSON.stringify({ success: true, id: response.insertedId }), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      throw new Error('Server document insertion failed');
    }
  } catch (e: any) {
    // Catch and return any errors that occur during the process
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
