import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { encryptCookie, getNewUserId } from 'controllers/utils';
import { setCookie } from 'cookies-next';

export async function GET(req: NextRequest) {
    try {
        console.log('feeds req: ', req.nextUrl)
        const response = NextResponse;
        const token = null;

        return response.json({ foo: 'bar', token });
    } catch (error) {
        return NextResponse.error();
    }
}