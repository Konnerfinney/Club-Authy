import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
export async function GET(req: NextRequest,res: NextResponse) {
    const token = await getToken({ req });
    console.log(token);
    return NextResponse.json({status: 'ok'});
}