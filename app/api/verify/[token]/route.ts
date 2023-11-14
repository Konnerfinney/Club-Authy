// Backend token verification

// pages/api/verify/[token].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req: NextApiRequest) {
    try{
        const token = request.nextUrl.pathname.split('/').pop();
        
            const client = await clientPromise;
            const db = client.db('Discord_Bot');
            const collection = db.collection('Moderated Servers');
            const server = await collection.findOne({ discordServerId: serverId });
        
            if (server) {
              return new Response(JSON.stringify({ isModerated: true }), {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            } else {
              return new Response(JSON.stringify({ isModerated: false }), {
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


  // Logic to check the database for the token
  // This is pseudocode and will depend on your database setup
  const user = await findUserByToken(token);

  if (user) {
    // Update user's verification status in the database
    res.status(200).json({ message: 'Email verified successfully' });
  } else {
    // No user found with the token or token is invalid
    res.status(404).json({ message: 'Invalid or expired token' });
  }
}

async function findUserByToken(token){

}