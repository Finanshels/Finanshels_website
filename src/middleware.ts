import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'finanshels_admin_v2'
const LEGACY_COOKIE_NAME = 'finanshels_admin'
const LOGIN_PATH = '/admin/login'
// FIX-048: `/admin/accept-invite` is the unauthenticated invitation-acceptance
// page — invitees must reach it without a session cookie. Previously
// middleware redirected them to login, breaking the invite flow entirely.
// `/admin/forgot` and `/admin/reset` were removed: no backing page exists
// under src/app/admin/ and there is no self-serve password-reset flow yet
// (admins reset other users' passwords from /admin/settings/users).
const PUBLIC_ADMIN_PREFIXES = ['/admin/login', '/admin/logout', '/admin/accept-invite']

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
