import { getToken, decode } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppRoutes } from "./utils/routes";
import { Config } from "./utils/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log(`Middleware triggered for path: ${pathname}`);

  const skipPaths = [
    "/_next",
    "/api/",
    "/favicon.ico",
    "/static/",
    "/public/",
    "/l/",
    "/terms-and-condition",
    "/.well-known/",
  ];

  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  const tokenName = Config.env.app.next_auth_cookie_name;
  const tokenFromCookie = req.cookies.get(tokenName)?.value;
  // console.log("token-cookie:", tokenFromCookie);
  const token = await decode({
    secret:
      process.env.NEXTAUTH_SECRET ||
      process.env.AUTH_SECRET ||
      process.env.AUTH_SECRET_1 ||
      "savebucksaffiliateportal",
    salt: tokenName,
    token: tokenFromCookie,
  });
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || process.env.AUTH_SECRET_1 || "savebucksaffiliateportal",
  // });

  // console.log("middleware-Token:", token);

  const authPaths = {
    signIn: AppRoutes.auth.signIn,
    signUp: AppRoutes.auth.signUp,
    forgotPassword: AppRoutes.auth.forgot_password,
    resetPassword: AppRoutes.auth.reset_password,
    pending: AppRoutes.auth.pending,
    verify_email: AppRoutes.auth.verify_email,
  };

  if (
    pathname.startsWith(AppRoutes.auth.reset_password) ||
    pathname.startsWith(AppRoutes.auth.verify_email)
  )
    return NextResponse.next();

  const isAuthPath = [
    authPaths.signIn,
    authPaths.signUp,
    authPaths.forgotPassword,
  ].includes(pathname);

  // console.log("Is AUTH pATH:", isAuthPath);

  if (!token) {
    if (isAuthPath) return NextResponse.next();
    return NextResponse.redirect(new URL(authPaths.signIn, req.url));
  }

  // console.log("Token Found", token);

  if (isAuthPath) {
    // console.log(
    //   `User is authenticated, redirecting from auth path: ${pathname}`
    // );
    return NextResponse.redirect(new URL(AppRoutes.dashboard, req.url));
  }

  if (pathname === "/") {
    // console.log(
    //   `User is authenticated, redirecting from auth path: ${pathname}`
    // );
    return NextResponse.redirect(new URL(AppRoutes.dashboard, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
