import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not logged in and trying to access dashboard, redirect to authentication
  if (!session && req.nextUrl.pathname.startsWith('/pages/dashboard')) {
    return NextResponse.redirect(new URL('/pages/authentication', req.url))
  }

  // If user is logged in and trying to access authentication page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/pages/authentication') {
    return NextResponse.redirect(new URL('/pages/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/pages/dashboard/:path*', '/pages/authentication'],
}