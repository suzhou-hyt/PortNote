import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken';


interface LoginRequest {
    username: string;
    password: string;
}


export async function POST(request: NextRequest){
    try {
        const body: LoginRequest = await request.json()
        const {username, password} = body;

        // Check if all env vars are defined
        if(!process.env.JWT_SECRET || !process.env.USER_SECRET){
            throw new Error('JWT_SECRET and/or USER_SECRET not set')
        }
        if(!process.env.LOGIN_USERNAME || !process.env.LOGIN_PASSWORD){
            throw new Error('LOGIN_USERNAME and/or LOGIN_PASSWORD not set')
        }

        // Check if credentials are correct
        if(username != process.env.LOGIN_USERNAME || password != process.env.LOGIN_PASSWORD){
            return NextResponse.json({error: "Wrong credentials"}, {status: 401})
        }

        // Generate jwt token
        const token = jwt.sign({user_secret: process.env.USER_SECRET}, process.env.JWT_SECRET, {expiresIn: '7d'})

        return NextResponse.json({token: token});

    } catch (error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}