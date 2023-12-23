import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        console.log('sources req: ', req.nextUrl)
        const response = NextResponse;
        const token = null;

        return response.json({ doh: 'doz', token });
    } catch (error) {
        return NextResponse.error();
    }
}