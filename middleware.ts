import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

async function isAdminSession(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get('session')?.value
  if (!session) return false
  try {
    const payload = await decrypt(session)
    return payload?.user?.id === 'admin-1'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!(await isAdminSession(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // 2. Protect /api/upload - only allow authenticated admins
  if (pathname.startsWith('/api/upload')) {
    if (!(await isAdminSession(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload/:path*'],
}
