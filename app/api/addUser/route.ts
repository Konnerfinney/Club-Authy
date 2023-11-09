// app/api/test/route.ts
import clientPromise from '../../utils/mongodb';

export async function POST(request) {
  try {
    // Parse the incoming request body to get the user data
    const body = await request.json();
    const { discordServerId, discordUserId, userName, userEmail, userComment } = body;

    
    if (!discordServerId || !discordUserId || !userName || !userEmail) {
      return new Response(JSON.stringify({ error: 'Missing required user information' }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Initialize the MongoDB client and connect to the database
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); // Replace with your actual database name

    // Define the document to insert
    const doc = {
      discordServerId,
      discordUserId,
      userName,
      userEmail,
      userComment: userComment || "",
      createdAt: new Date(), 
    };

    // Insert the document into the collection
    const collection = db.collection("Unauthenticated Users"); //
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
      throw new Error('Document insertion failed');
    }
  } catch (e) {
    // Catch and return any errors that occur during the process
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
