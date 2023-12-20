import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    console.log('cookies from router: ', cookies());

    return NextResponse.json({ foo: 'bar' });
}