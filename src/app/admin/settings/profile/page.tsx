import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SettingsSidebar } from '@/components/cms/admin/SettingsSidebar'
import {
  destroyAdminSession,
  requireAdminAuth,
  sessionDisplayName,
  sessionRole,
  sessionUserId,
} from '@/lib/cms/adminAuth'
import { resetUserPassword } from '@/lib/cms/usersRepository'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ ok?: string; error?: string }>

const PROFILE_PATH = '/admin/settings/profile'

async function changeOwnPasswordAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('viewer')
  if (session.kind !== 'user') {
    redirect(`${PROFILE_PATH}?error=env-no-profile`)
  }
  const userId = session.user.id
  const password = String(formData.get('newPassword') ?? '')
  if (password.length < 8) {
    redirect(`${PROFILE_PATH}?error=weak-password`)
  }
  try {
    await resetUserPassword(userId, password)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    redirect(`${PROFILE_PATH}?error=${encodeURIComponent(msg)}`)
  }
  // Bumping tokenVersion invalidates this session — redirect to login.
  await destroyAdminSession()
  revalidatePath(PROFILE_PATH)
  redirect('/admin/login?ok=password-changed')
}

export default async function ProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminAuth('viewer')
  const params = await searchParams
  const role = sessionRole(session)

  return (
    <section className="min-h-screen bg-[#f7f3ee] text-slate-900">
      <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
        <div className="grid gap-3 xl:min-h-[calc(100vh-1.5rem)] xl:grid-cols-[minmax(260px,320px)_1fr]">
          <SettingsSidebar
            active="profile"
            currentRole={role}
            currentUserName={sessionDisplayName(session)}
            currentUserEmail={session.kind === 'user' ? session.user.email : null}
          />

          <div className="space-y-4 rounded-2xl border border-[#e8dccf] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] xl:overflow-y-auto">
            <header>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Settings</p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">My profile</h1>
              <p className="mt-1 text-sm text-slate-500">{sessionDisplayName(session)}{session.kind === 'user' ? ` · ${session.user.email}` : ''}</p>
            </header>

            {params.ok ? (
              <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                Done.
              </p>
            ) : null}
            {params.error ? (
              <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {params.error === 'weak-password'
                  ? 'Password must be at least 8 characters.'
                  : params.error === 'env-no-profile'
                  ? 'You signed in with the env bootstrap password. Create a real user in Settings → Users first.'
                  : `Action failed: ${params.error}`}
              </p>
            ) : null}

            <section className="rounded-2xl border border-[#e8dccf] bg-[#fffaf5] p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Change password</h2>
              <form action={changeOwnPasswordAction} className="mt-4 grid gap-3 max-w-md">
                <label className="block text-sm text-slate-700">
                  New password (≥ 8 chars)
                  <input
                    type="password"
                    name="newPassword"
                    required
                    minLength={8}
                    className="mt-1.5 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </label>
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition hover:brightness-110"
                >
                  Save new password
                </button>
                <p className="text-xs text-slate-500">You will be signed out and asked to log back in with the new password.</p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
