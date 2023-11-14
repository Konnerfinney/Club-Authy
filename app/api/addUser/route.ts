// app/api/addUser/route.ts
require('dotenv').config();
const { randomBytes } = require('crypto');

import clientPromise from '../../utils/mongodb';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'konner.programming@gmail.com',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});
export async function POST(request) {

  try {
    // Parse the incoming request body to get the user data
    const body = await request.json();
    console.log(body);
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
    // Initialize the MongoDB client and connect to the database
    const client = await clientPromise;
    const db = client.db("Discord_Bot"); 

    // Define the document to insert
    const doc = {
      discordServerId,
      discordUserId,
      userName,
      userEmail,
      userComment: userComment || "",
      userAuthToken,
      createdAt: new Date(), 
    };
    //  

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


function generateVerificationToken() {
  return randomBytes(32).toString('hex');
}

async function sendMail(userEmail, verificationToken) {
  let mailOptions = {
    from: 'konner.programming@gmail.com',
    to: userEmail,
    subject: 'Verify Your Email',
    html: `
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}