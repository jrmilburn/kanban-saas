// middleware.js  (project root)
import { NextResponse } from 'next/server'
import { getToken }   from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET   // same one you pass to NextAuth

export async function middleware(req) {
  /**
   * getToken() parses and verifies the JWT cookie entirely in memory.
   * It works in the Edge runtime and adds zero extra npm weight.
   */
  const token = await getToken({ req, secret })

  // ─── No session → send to login ───
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in → allow the request to reach the server component,
  // which will do the Prisma workspace check.
  return NextResponse.next()
}

/* Protect board pages and the board list */
export const config = {
  matcher: ['/boards', '/board/:path*'],
}
