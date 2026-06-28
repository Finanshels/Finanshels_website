// Client-safe helper: derive up-to-two-letter initials from a name (falling
// back to an email). Shared by the admin avatars (members + leads).

export function initialsOf(name: string, email = ''): string {
  const source = name.trim() || email.trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}
