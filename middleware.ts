import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import * as jose from 'jose';

export async function middleware(req:NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // Informacion util sobre el usuario
  // console.log({session});

  if(!session) {
    const requestedpage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedpage}`;
    return NextResponse.redirect(url);
  }
  
  // return NextResponse.redirect(new URL('/about-2', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/address','/checkout/summary']
};

// export async function middleware(req:NextRequest, ev:NextFetchEvent) {

//   if (req.nextUrl.pathname.startsWith('/checkout')) {
//     const token = req.cookies.get('token')?.value || '';

//     try {
//       await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
//       return NextResponse.next();
//     } catch (error) {
//       return NextResponse.redirect(`http://localhost:3000/auth/login?p=${config.matcher}`);
//     }
//   }
  
// }

// export const config = {
//   matcher: '/checkout/address',
// };