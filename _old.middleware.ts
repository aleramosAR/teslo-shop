import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "./utils";
import * as jose from 'jose';

export async function middleware(req:NextRequest, ev:NextFetchEvent) {

  if (req.nextUrl.pathname.startsWith('/checkout')) {

    const token = req.cookies.get('token')?.value || '';

    // return new Response('No autorizado', {
    //   status: 401
    // });

    try {
      // await jwt.isValidToken(token);

      await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));

      return NextResponse.next();
      // return Response.redirect('/auth/login');
    } catch (error) {
      
      // Esto funciona pero no es recomendado por next
      return NextResponse.redirect(`http://localhost:3000/auth/login?p=${config.matcher}`);

      // return NextResponse.redirect('/auth/login?p=');
      // console.log(req.url);
    }
  }
  
}

export const config = {
  matcher: '/checkout/address',
};