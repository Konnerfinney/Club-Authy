// app/api/addUser/route.ts
require('dotenv').config();
const { randomBytes } = require('crypto');
import clientPromise from '../../utils/mongodb';
import { generateVerificationToken } from '../../utils/authToken';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {

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
    const userAuthToken = generateVerificationToken();
    console.log(userAuthToken);
    // Initialize the MongoDB client and connect to the database
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); 
    const userAuthStatus = 'unauthenticated';
    // Define the document to insert
    const doc = {
      discordServerId,
      discordUserId,
      userName,
      userEmail,
      userComment: userComment || "",
      userAuthToken,
      userAuthStatus,
      createdAt: new Date(), 
    };
    //  

    // Insert the document into the collection
    const collection = db.collection("users"); //
    // Check if the user exists and then delete if it does to replace with new data
    const userExists = await collection.findOne({ 
      discordServerId, 
      discordUserId 
    });
    if (!!userExists) {
      await collection.deleteOne(userExists);
    }
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



