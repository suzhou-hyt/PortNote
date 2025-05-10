import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ValidateRequest {
    token: string;
}

export async function POST(request: NextRequest){
    try{
        const body: ValidateRequest = await request.json()
        const { token } = body;

        // check if JWT_SECRET and USER_SECRET exists
        if(!process.env.JWT_SECRET || !process.env.USER_SECRET){
            throw new Error('JWT_SECRET and/or USER_SECRET not set')
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {id: string};
        if(!decoded.user_secret) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        // Check if secret is correct
        if(decoded.user_secret != process.env.USER_SECRET){
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        return NextResponse.json({message: 'validated'})
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}