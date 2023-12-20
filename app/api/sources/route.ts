import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { nextUrl } = req;
    const { searchParams } = nextUrl;

    return NextResponse.json({ doh: 'doz' });
}