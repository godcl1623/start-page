import { encryptCookie, getNewUserId } from 'controllers/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        if (req.nextUrl.origin !== process.env.NEXTAUTH_URL) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const newUserId = getNewUserId();
        const userCookie = encryptCookie({ userId: newUserId });
        return NextResponse.json({ userCookie });
    } catch (error) {
        return NextResponse.error();
    }
}