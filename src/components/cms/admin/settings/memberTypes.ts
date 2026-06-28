import type { CmsUserRole, CmsUserStatus } from '@/lib/cms/roles'

/**
 * Presentation view-model for a CMS user in the Users & access screen.
 *
 * Dates are pre-formatted to strings on the server (page.tsx) so the client
 * roster/drawer never call `toLocaleString` during hydration — that would
 * diff between the SSR pass and the browser when timezones differ.
 */
export interface MemberView {
  id: string
  name: string
  email: string
  role: CmsUserRole
  status: CmsUserStatus
  /** Formatted `createdAt`, or '—' when absent. */
  createdLabel: string
  /** Formatted `lastLoginAt`, or '—' when absent. */
  lastLoginLabel: string
}

/** A server action bound to a member form (matches the page's action signatures). */
export type MemberAction = (formData: FormData) => void | Promise<void>

/**
 * The five per-member server actions, passed from the server page into the
 * client roster/drawer. Action bodies stay in page.tsx (the `requireAdminAuth`
 * paths) — only references cross the client boundary.
 */
export interface MemberActions {
  updateRole: MemberAction
  updateStatus: MemberAction
  resendInvite: MemberAction
  resetPassword: MemberAction
  deleteUser: MemberAction
}
