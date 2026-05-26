# Webflow → Vercel DNS Cutover Runbook

> **Operator runbook for the production DNS flip.** This document is read-only —
> the only "code" change Plan 5 needs is the cutover itself. Everything is in the
> Vercel + DNS provider UIs.

**Date drafted:** 2026-05-26
**Status:** Awaiting scheduled cutover
**Related spec:** [2026-05-22-webflow-migration-design.md](../specs/2026-05-22-webflow-migration-design.md)
**Related plan:** [2026-05-22-webflow-migration-foundation.md](2026-05-22-webflow-migration-foundation.md)
**Branch / PR history:** PR #2 + PR #3 (merged); content migration commits land on `main`.

---

## Pre-cutover state (already in place)

- All 729 docs imported across 13 Firestore CMS collections.
- All images on Firebase Storage (`firebasestorage.googleapis.com`). Asset audit confirmed **zero residual Webflow CDN references** in any Firestore field.
- Production Vercel deploy of `Finanshels/Finanshels_website` on `main` is **live and healthy** (verified at https://vercel.com/finanshels-original/finanshels-website).
- `legacyRedirects()` in `next.config.mjs` populated with **24 pattern-based 301 redirects** covering Webflow CMS detail routes that don't 1:1 match Next.js.
- `npm run redirects:import` script ready for GSC CSV → hand-curated entries.

---

## What still needs to happen before T-0

### Step A — GSC export → curated specific redirects (recommended, not blocking)

1. Open Google Search Console for the property covering `https://finanshels.com`.
2. **Performance → Pages → Export → CSV** (last 90 days).
3. Run: `npm run redirects:import path/to/gsc-pages-export.csv`
4. Review the generated entries. For each:
   - High-traffic legacy URL → confirm the destination is correct (likely the matching `/blog/<slug>` or `/glossary/<slug>` passthrough).
   - Anything that maps to `/?webflow-legacy=1` (the catch-all) → decide on a better destination, or leave to fall through to home.
5. Paste the curated entries into `SPECIFIC_REDIRECTS` in `next.config.mjs:legacyRedirects()`.
6. Open a small PR titled e.g. `feat(seo): GSC-curated 301 redirects` and merge.

**Why "recommended, not blocking":** the 24 PATTERN_REDIRECTS already cover every CMS collection's URL shape. The GSC step adds insurance for any hand-edited Webflow URLs or vanity paths that don't match a pattern.

### Step B — staging URL for stakeholder review (optional)

The Vercel production URL (e.g. `finanshels-website-finanshels-original.vercel.app` or whatever's configured) already serves the migrated site. You have two choices:

| Option | Pros | Cons |
|---|---|---|
| **Use the Vercel URL directly** | Zero setup, no DNS. | Ugly URL; stakeholders may confuse it with prod. |
| **Add `staging.finanshels.com` as a Vercel alias** | Clean URL. | New DNS record + Vercel domain attachment. |

For the alias route:
1. In Vercel project → **Settings → Domains → Add** → `staging.finanshels.com`
2. Vercel shows a CNAME to add at your DNS provider: `staging` → `cname.vercel-dns.com`
3. Add the CNAME at the registrar (TTL default is fine for staging).
4. Wait for DNS propagation (~5 min usually).
5. Test that `https://staging.finanshels.com` renders the new site.

**Noindex on staging hostname (defensive):** if you use the staging alias, add a middleware rule that emits `X-Robots-Tag: noindex` when `request.headers.get('host') === 'staging.finanshels.com'`. Small follow-up; not in scope for Plan 5.

---

## T-minus checklist

Run through these in order. Each step should be done by the person flipping DNS (not Claude).

| When | Action | Owner | Verification |
|---|---|---|---|
| **T-14d** | Final feature freeze: no merges to `main` except cutover-related fixes. | eng | `git tag migration-freeze-$(date +%F)` |
| **T-7d** | Drop DNS TTL on `finanshels.com` (A, AAAA, www CNAME) from default (often 3600s) to **300s** (5 min). | infra | `dig finanshels.com A +noall +answer` shows TTL ≤ 300 |
| **T-7d** | Add `finanshels.com` as a domain in the Vercel project (Settings → Domains → Add). Vercel will show the required DNS values. **Do not switch DNS yet** — just attach the domain on Vercel's side so the cert + edge network are ready. | infra | Vercel project shows `finanshels.com` with "Invalid configuration" (expected; the DNS isn't pointed yet) |
| **T-3d** | Final importer dry-run on staging Firestore (if you migrated any new Webflow content between then and now): `npm run webflow:import -- --all --dry-run`. Read the per-collection reports. | eng | All reports show `failureCount: 0` |
| **T-3d** | Re-run live imports for any collections with new Webflow content. Idempotent by slug. | eng | Firestore counts increase to match Webflow counts |
| **T-2d** | Run the asset audit script one more time. Should still report zero leaks. | eng | "CLEAN — zero residual references" |
| **T-2d** | Content QA pass on the Vercel preview URL: spot-check top 20 pages from GSC. | content + design | sign-off in shared doc |
| **T-1d** | Webflow custom-code freeze (no edits in Webflow after this point). | content | Slack announcement |
| **T-1d** | Search Console: take baseline screenshot of top-20 ranking pages so you can compare 30 days post-cutover. | SEO | screenshot stored in `tmp/` (or wherever) |
| **T-0** | **DNS flip** — see "DNS flip details" below. | infra | `curl -sI https://finanshels.com \| grep -i 'server\|x-vercel'` returns Vercel headers |
| **T+1h** | Lighthouse mobile audit on top-20 URLs. | eng | scores recorded |
| **T+1h** | Run structured-data validator (Schema.org) on top-5 URLs. | SEO | no JSON-LD errors |
| **T+6h** | Vercel **Runtime Logs** review: 4xx/5xx baseline. | eng | error rate < 0.5% |
| **T+24h** | Crawl `/sitemap.xml` for internal 404s with a script: `scripts/link-check.mjs` (write if not present). | eng | zero internal 404s |
| **T+7d** | Archive Webflow site (don't cancel): in Webflow → Project settings → take a backup export. | ops | export downloaded |
| **T+30d** | Cancel Webflow subscription if Search Console reindex looks healthy. | ops | confirm new property has indexed top-20 pages |

---

## DNS flip details (T-0)

### What Vercel needs

Once `finanshels.com` is attached to the Vercel project (T-7d step), Vercel displays the exact DNS values. They are typically:

| Record | Host | Value |
|---|---|---|
| `A` | `@` (apex) | `76.76.21.21` |
| `AAAA` | `@` (apex) | `2600:1f18:f7:ff70::1` (varies — read from Vercel UI) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> **DO NOT hardcode the IPs above.** Always copy the exact values from the Vercel
> dashboard at flip time. Vercel rotates IPs occasionally.

### What to change at the registrar

1. Log in to the DNS provider managing `finanshels.com` (Cloudflare? Route 53? GoDaddy? — confirm before T-7d).
2. Note the current Webflow A/AAAA values (write them down — needed for rollback).
3. Update the `@` A record to the Vercel-provided value.
4. Update the `@` AAAA record to the Vercel-provided IPv6 (if Vercel provides one for your plan).
5. Update the `www` CNAME to `cname.vercel-dns.com` (was likely `proxy-ssl.webflow.com`).
6. **Save.** Propagation begins immediately because TTL is 300s (from T-7d).

### Verification (run within 10 minutes of save)

```bash
dig finanshels.com A +short              # expect Vercel anycast IP
dig www.finanshels.com CNAME +short      # expect cname.vercel-dns.com
curl -sI https://finanshels.com | head   # expect 'server: Vercel'
curl -sL -o /dev/null -w '%{http_code} %{url_effective}\n' https://finanshels.com/blog
                                          # expect 200 https://finanshels.com/blog
```

### One-line smoke check after flip

```bash
for path in / /blog /glossary /about /pricing /contact /customers /services; do
  curl -s -o /dev/null -w "$path → %{http_code}\n" "https://finanshels.com${path}"
done
```

All paths should be `200`. Anything `5xx` is a Vercel deploy issue (rollback or fix-forward). Anything `404` is a route gap (fix-forward, not necessarily a rollback trigger).

---

## Rollback

**Trigger conditions** (any of):
- Sustained `5xx` rate > 5% over 5 minutes (visible in Vercel **Observability → Logs**).
- Critical user-facing functionality broken (e.g. contact form returns errors).
- Stakeholder rollback call.

**Action:**
1. At the DNS provider, revert the `@` A record (and AAAA) back to the Webflow IPs noted in T-7d.
2. Revert the `www` CNAME back to `proxy-ssl.webflow.com`.
3. TTL is 300s → DNS propagates to most resolvers in ≤5 minutes.
4. Webflow site keeps serving (it was never decommissioned — that's the T+30d step).

**State preservation during rollback:**
- Firestore content is unchanged (rollback doesn't touch it).
- Vercel deploy stays live but receives no public traffic.
- Webflow site is still paid-up + serving.

**Post-rollback:**
- Root-cause review.
- Fix forward on a new branch + PR.
- Schedule a new cutover window.

---

## Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DNS TTL not actually 300s at T-0 (registrar caches at higher value) | Low | High | Verify with `dig` 24h before T-0; if not honored, push cutover 24h. |
| SEO ranking dip post-cutover | Med | Med | Comprehensive PATTERN_REDIRECTS already in place; GSC-curated SPECIFIC_REDIRECTS for high-traffic pages; submit new sitemap; monitor 30 days. |
| Internal 404s from pages that linked to legacy Webflow URLs | Med | Low | T+24h broken-link sweep over `/sitemap.xml` + Vercel logs review. |
| Form submission breakage (Resend / contact handler) | Low | High | Test contact form on Vercel URL pre-cutover; logs visible immediately in Vercel. |
| Firestore quota spike from increased reads | Low | Med | Existing per-route cache + revalidation already in place. Watch Firestore usage at T+1h. |
| Vercel deploy unhealthy at T-0 | Low | High | Last successful deploy check at T-7d when domain is attached. Any post-T-7d deploys must be verified before T-0. |

---

## Search Console after cutover

1. Within 1h of T-0: **verify the existing `finanshels.com` Search Console property** still works (it should — hostname unchanged). No "Change of address" tool needed.
2. **Submit the new sitemap**: `Sitemaps → Add a new sitemap → sitemap.xml`. (May already be listed; resubmit to force a recrawl.)
3. **Request URL inspection** on the top-20 GSC pages (one-by-one): paste URL → "Request indexing". This pulls them into Google's queue faster than waiting for the next natural crawl.
4. For 30 days post-cutover: watch **Search Console → Coverage** for spike in 404s. The PATTERN_REDIRECTS + SPECIFIC_REDIRECTS should keep this near zero. Anything that does 404 needs a targeted redirect or fix.

---

## Decommissioning Webflow (T+30d)

Only after:
- ≥ 30 days post-cutover with no rollback events.
- Search Console shows the top-20 ranking pages are re-indexed and serving from `finanshels.com` (which now means Vercel).
- Asset audit re-run shows zero leaks (still).

Then:
1. Webflow → Project settings → final backup export (zip).
2. Move the backup to long-term cold storage (S3 Glacier or similar).
3. Webflow → Account → cancel subscription.
4. Note the cancellation date in this runbook and close out Plan 5.

---

## Open items / decisions needed before T-0

- [ ] Confirm which DNS provider holds `finanshels.com` (Cloudflare / Route 53 / registrar-managed?). Add to this doc.
- [ ] Decide on staging hostname strategy (use Vercel URL vs. add `staging.finanshels.com`).
- [ ] Choose a cutover date + time. Recommended: a quiet weekday morning (UAE timezone) so you have full team availability for the monitoring window.
- [ ] Decide who owns each row in the T-minus checklist.
- [ ] Run GSC export → curate SPECIFIC_REDIRECTS (recommended for SEO).
