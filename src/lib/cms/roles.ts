// Client-safe role catalog — the single source of truth for CMS user roles.
//
// This module intentionally has NO `server-only` / `firebase-admin` imports so
// the role types, labels, and rank helpers can be shared with client components
// (e.g. the Users & access roster/drawer) without dragging the Admin SDK into
// the browser bundle (the c5d6155 precedent). `usersRepository.ts` re-exports
// everything here so existing `@/lib/cms/usersRepository` imports keep working.

export type CmsUserRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type CmsUserStatus = 'active' | 'disabled' | 'invited'

export const ROLE_RANK: Record<CmsUserRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
  owner: 4,
}

export const ROLE_LABEL: Record<CmsUserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

export const ROLE_DESCRIPTION: Record<CmsUserRole, string> = {
  owner: 'Full access. Can manage users, including other owners.',
  admin: 'Full CMS + user management (cannot remove owners).',
  editor: 'Create, edit, and publish content. No user management.',
  viewer: 'Read-only access to CMS content.',
}

export function isValidRole(value: unknown): value is CmsUserRole {
  return value === 'owner' || value === 'admin' || value === 'editor' || value === 'viewer'
}

export function roleAtLeast(actual: CmsUserRole, required: CmsUserRole): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[required]
}
