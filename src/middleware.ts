import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api",
];

export async function middleware(request: NextRequest) {
  // if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
  //   return NextResponse.next();
  // }

  // const sessionCookie = getSessionCookie(request, {
  //   cookieName: "session_token",
  //   cookiePrefix: "better-auth",
  //   useSecureCookies: false,
  // });

  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
