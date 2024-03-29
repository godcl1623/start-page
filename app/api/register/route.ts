import { encryptCookie, getNewUserId } from 'controllers/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    console.log('origin input: ', req.nextUrl.origin, ', origin set: ', process.env.REGISTER_ORIGIN)
    try {
        if (req.nextUrl.origin !== process.env.REGISTER_ORIGIN) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const newUserId = getNewUserId();
        const userCookie = encryptCookie({ userId: newUserId });
        return NextResponse.json({ userCookie });
    } catch (error) {
        return NextResponse.error();
    }
}