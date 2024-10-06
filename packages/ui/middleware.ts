import { NextResponse } from "next/server";

export function middleware() {
  // TODO: Convert this to use cors.middleware (currently API only) or https://nextjs.org/docs/app/building-your-application/routing/middleware#cors

    // retrieve the current response
    const res = NextResponse.next()

    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', 'https://www.owlbear.rodeo') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}

export const config = {
  matcher: '/(api/.*)', // match all api paths
}