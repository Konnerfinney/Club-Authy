
// app/api/moderated-servers.ts
import clientPromise from '../../utils/mongodb';

export async function GET() {
  try {
    // Initialize the MongoDB client and connect to the database
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); // Replace with your actual database name

    // Fetch the documents from the collection
    const collection = db.collection("Moderated Servers"); // Update with your actual collection name
    const moderatedServers = await collection.find({}).toArray(); // You can add query filters as needed

    // Respond with the list of moderated servers
    return new Response(JSON.stringify(moderatedServers), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });

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