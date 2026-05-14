import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'finanshels_admin_v2'
const LEGACY_COOKIE_NAME = 'finanshels_admin'
const LOGIN_PATH = '/admin/login'
const PUBLIC_ADMIN_PREFIXES = ['/admin/login', '/admin/logout', '/admin/forgot', '/admin/reset']

// FIX-012: defense-in-depth admin auth guard. Routes under /admin/* require a
// session cookie. Per-page `requireAdminAuth()` still performs the full
// signature + role check; this layer just blocks unauthenticated requests
// from reaching admin code at all, so a new admin route added without an
// explicit auth call is still protected.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC_ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  const hasSession =
    Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value) ||
    Boolean(req.cookies.get(LEGACY_COOKIE_NAME)?.value)

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = LOGIN_PATH
    url.searchParams.set('next', pathname + (req.nextUrl.search || ''))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
