// Backend token verification
// pages/api/verify/[token].ts
import type { NextRequest } from 'next/server';
import clientPromise from '../../../utils/mongodb';

export async function POST(req: NextRequest, { params }: {params: {token: string}}) {
    try{
        const token = params.token;
        const body = await req.json();
        const { discordServerId, discordUserId } = body;
        const client = await clientPromise;
        const db = client.db('Discord_Bot');
        const collection = db.collection('users');
        const user = await collection.findOne({ discordServerId: discordServerId, discordUserId: discordUserId, userAuthToken: token });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
              status: 404,
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
        const result = await collection.updateOne(user, { $set: { userAuthStatus: 'authenticated' } });
        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            } else {
              return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            }
    
        
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