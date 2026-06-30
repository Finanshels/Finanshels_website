import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { getAnnouncement, setAnnouncement } from '@/lib/cms/siteSettingsRepository'
import { Alert, Button, Card, Input } from '@/components/cms/admin/ui'

/**
 * FIX-078: site-wide announcement / nudge manager. Admin-only. Writes the single
 * `site_config/announcement` doc; AppChrome renders it on every marketing page.
 */

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ ok?: string }>

async function saveAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const toneRaw = String(formData.get('tone') ?? 'brand')
  const tone = toneRaw === 'dark' || toneRaw === 'urgent' ? toneRaw : 'brand'
  await setAnnouncement({
    enabled: formData.get('enabled') === 'on',
    message: String(formData.get('message') ?? ''),
    ctaLabel: String(formData.get('ctaLabel') ?? ''),
    ctaUrl: String(formData.get('ctaUrl') ?? ''),
    countdownTo: String(formData.get('countdownTo') ?? '').trim() || null,
    tone,
  })
  // Layout reads the doc; bust the homepage + a couple of high-traffic routes.
  revalidatePath('/', 'layout')
  redirect('/admin/announcement?ok=1')
}

export default async function AnnouncementAdminPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminAuth('admin')
  const { ok } = await searchParams
  const current = await getAnnouncement()
  // <input type="datetime-local"> wants `YYYY-MM-DDTHH:mm` — trim a stored ISO.
  const countdownLocal = current.countdownTo ? current.countdownTo.slice(0, 16) : ''

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/admin/cms"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to CMS
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Announcement &amp; countdown</h1>
        <p className="mt-2 text-sm text-slate-600">
          A dismissable nudge shown site-wide (bottom-left). Add a deadline for a live countdown —
          the nudge auto-hides once it lapses.
        </p>
      </div>

      {ok ? (
        <div className="mt-5">
          <Alert variant="success">Announcement saved.</Alert>
        </div>
      ) : null}

      <Card className="mt-6 p-6">
        <form action={saveAction} className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={current.enabled}
              className="size-4 rounded border-slate-300"
            />
            Show the announcement
          </label>

          <Input
            name="message"
            label="Message"
            defaultValue={current.message}
            placeholder="VAT filing deadline is approaching — file now."
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="ctaLabel" label="Button label (optional)" defaultValue={current.ctaLabel} placeholder="Book a call" />
            <Input name="ctaUrl" label="Button link (optional)" defaultValue={current.ctaUrl} placeholder="/contact" />
          </div>

          <Input
            name="countdownTo"
            label="Countdown deadline (optional)"
            type="datetime-local"
            defaultValue={countdownLocal}
            helperText="Leave blank for a plain nudge with no timer."
          />

          <div className="space-y-1.5">
            <label htmlFor="tone" className="text-[13px] font-medium text-slate-800">
              Style
            </label>
            <select
              id="tone"
              name="tone"
              defaultValue={current.tone}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="brand">Brand (orange)</option>
              <option value="dark">Dark</option>
              <option value="urgent">Urgent (red)</option>
            </select>
          </div>

          <Button type="submit" variant="primary">
            Save announcement
          </Button>
        </form>
      </Card>
    </div>
  )
}
