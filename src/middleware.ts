import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/maintenance/")
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/maintenance", req.url));
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // 静的ファイル, _next は除外
};
