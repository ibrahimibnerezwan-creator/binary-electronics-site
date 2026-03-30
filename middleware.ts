import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Check if the route is /admin but NOT /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await decrypt(session)
      return NextResponse.next()
    } catch (error) {
      // Session expired or invalid
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. Protect /api/upload - only allow authenticated admins
  if (pathname.startsWith('/api/upload')) {
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
      await decrypt(session)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload/:path*'],
}
