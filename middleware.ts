import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // 현재 요청에서 "mw" 쿠키 확인
    const mwCookie = request.cookies.get("mw");

    // "mw" 쿠키가 없으면 새로운 응답을 생성하고 쿠키 설정
    if (!mwCookie?.value) {
        const response = NextResponse.next();

        // 고유한 값을 생성 (nanoid 사용)
        const cookieValue = crypto.randomUUID();

        // 쿠키 설정 (30일 만료, httpOnly, secure 옵션 포함)
        response.cookies.set("mw", cookieValue, {
            maxAge: 60 * 60 * 24 * 30, // 30일
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;
    }

    // "mw" 쿠키가 이미 존재하면 그대로 진행
    return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
    matcher: [
        /*
         * 다음 경로들을 제외한 모든 요청에 대해 실행:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};