//removeUnauthRole
const { removeUnauthRole } = require('../../../bot/bot')

import clientPromise from '../../utils/mongodb';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const {discordServerId, discordUserId} = body;
        const client = await clientPromise;
        const db = client.db("Discord_Bot"); 
        const collection = db.collection("users");
        const user = await collection.findOne({discordServerId, discordUserId});
        console.log("Approving User");
        if(!user){
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const result = await collection.updateOne(user, { $set: { userAuthStatus: 'approved' } });

        if (result.modifiedCount === 1) {
            await removeUnauthRole(discordServerId, discordUserId);
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } else {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
    }
    catch (error) {
        console.error('Database query error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}