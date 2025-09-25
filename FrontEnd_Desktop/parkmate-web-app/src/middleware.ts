import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathName = req.nextUrl.pathname;
  const loginUrl = new URL("/signin", req.url);

  // Allow static assets
  const isStaticAsset = pathName.startsWith("/_next") || /\.(png|jpg|jpeg|svg|css|js|ico)$/.test(pathName);

  // Attempt to access signin page when already logged in will be redirected to dashboard
  if (token && pathName === "/signin" && !isStaticAsset) {
    return NextResponse.redirect(req.url);
  }

  // Exempt /signin/ page from redirecting to itself & if token expired return to signin page
  if (!token && pathName !== "/signin" && !isStaticAsset) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const response = await fetch(`${backendUrl}/validate-token/${token}`);
    // const data = await response.json();

    // if (!data.success) {
    //   return NextResponse.redirect(loginUrl);
    // }
    // if (isStaticAsset) console.log(pathName);
    // else {
    //   console.log("token - ", token);        
    //   console.log("loginUrl - ", loginUrl);
    //   console.log("reqUrl - ", req.url);
    // }
    // console.log("------------------------");
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Match every route
};
