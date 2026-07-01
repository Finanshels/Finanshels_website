import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'finanshels_admin_v2'
const LEGACY_COOKIE_NAME = 'finanshels_admin'
const LOGIN_PATH = '/admin/login'
// FIX-048: `/admin/accept-invite` is the unauthenticated invitation-acceptance
// page — invitees must reach it without a session cookie. Previously
// middleware redirected them to login, breaking the invite flow entirely.
// `/admin/forgot` (request a reset email) and `/admin/reset` (set a new password
// from a token) are the self-serve password-reset pages — an unauthenticated
// user by definition can't hold a session, so both must be public. Each still
// validates its own single-use token server-side.
const PUBLIC_ADMIN_PREFIXES = [
  '/admin/login',
  '/admin/logout',
  '/admin/accept-invite',
  '/admin/forgot',
  '/admin/reset',
]

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
