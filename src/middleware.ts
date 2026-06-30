import { NextResponse, type NextRequest } from 'next/server'
import { isProductionSite } from '@/lib/cms/config'

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

// ---------------------------------------------------------------------------
// FIX-073: CMS-managed redirects (Webflow → Next migration safety).
// The edge runtime can't use firebase-admin, so rules are read from the cached
// Node route /api/redirects/active and held in module scope (best-effort per
// isolate) for REDIRECT_TTL_MS. Every lookup fails open — a Firestore/route
// problem yields "no redirect", never a broken site.
// ---------------------------------------------------------------------------
type RedirectRule = { from: string; to: string; permanent: boolean }
let redirectCache: { at: number; rules: RedirectRule[] } | null = null
const REDIRECT_TTL_MS = 60_000

async function loadRedirects(origin: string): Promise<RedirectRule[]> {
  if (redirectCache && Date.now() - redirectCache.at < REDIRECT_TTL_MS) {
    return redirectCache.rules
  }
  try {
    const res = await fetch(`${origin}/api/redirects/active`)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const body = (await res.json()) as { rules?: RedirectRule[] }
    const rules = Array.isArray(body.rules) ? body.rules : []
    redirectCache = { at: Date.now(), rules }
    return rules
  } catch {
    // Cache the last-known (or empty) set briefly so a failing route isn't hammered.
    redirectCache = { at: Date.now(), rules: redirectCache?.rules ?? [] }
    return redirectCache.rules
  }
}

/** Match the stored `from` normalisation: collapse a trailing slash (except root). */
function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.replace(/\/+$/, '')
  return pathname
}

function matchRedirect(req: NextRequest, rules: RedirectRule[]): NextResponse | null {
  if (rules.length === 0) return null
  const current = normalizePathname(req.nextUrl.pathname)
  const match = rules.find((rule) => rule.from === current)
  if (!match || match.to === current) return null
  const destination = /^https?:\/\//i.test(match.to)
    ? match.to
    : new URL(match.to + (req.nextUrl.search || ''), req.url)
  return NextResponse.redirect(destination, match.permanent ? 308 : 307)
}

// FIX-076: optional HTTP Basic gate for non-production deploys. Enabled only
// when STAGING_BASIC_AUTH_USER + _PASSWORD are set, so production (where they
// are unset) is never gated. Lets the team lock staging.finanshels.com behind a
// shared password while reviewing before the Webflow cutover.
function checkStagingAuth(req: NextRequest): NextResponse | null {
  const user = process.env.STAGING_BASIC_AUTH_USER
  const pass = process.env.STAGING_BASIC_AUTH_PASSWORD
  if (!user || !pass) return null // gate disabled

  const header = req.headers.get('authorization') ?? ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const sep = decoded.indexOf(':')
      if (sep !== -1 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === pass) {
        return null // authorised
      }
    } catch {
      /* malformed header → challenge below */
    }
  }
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Finanshels staging", charset="UTF-8"' },
  })
}

// FIX-012: defense-in-depth admin auth guard. Routes under /admin/* require a
// session cookie. Per-page `requireAdminAuth()` still performs the full
// signature + role check; this layer just blocks unauthenticated requests
// from reaching admin code at all, so a new admin route added without an
// explicit auth call is still protected.
function adminGuard(req: NextRequest): NextResponse {
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProd = isProductionSite()

  // 0) Staging gate — block the whole non-production site behind Basic auth
  //    when configured. Runs before everything so nothing leaks pre-cutover.
  if (!isProd) {
    const gate = checkStagingAuth(req)
    if (gate) return gate
  }

  let response: NextResponse

  // 1) Admin auth guard — unchanged behaviour for /admin/*.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    response = adminGuard(req)
  } else {
    // 2) CMS-managed redirects for public paths.
    const rules = await loadRedirects(req.nextUrl.origin)
    response = matchRedirect(req, rules) ?? NextResponse.next()
  }

  // 3) Non-production deploys are never indexable (belt-and-suspenders with
  //    robots.ts — a header still blocks indexing of directly-linked URLs).
  if (!isProd) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}

export const config = {
  // All routes except Next internals, API routes, and static files (anything
  // with a file extension). /admin/* stays included so the auth guard runs.
  matcher: ['/((?!api/|_next/|.*\\.[\\w]+$).*)'],
}
