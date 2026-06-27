// Client-safe shared constants for media uploads.
// Kept in its own file so client components (CmsMediaLibrary) can read the
// size limit without pulling firebase-admin into the browser bundle —
// persistMediaAssetUpload.ts imports server-only Firebase Admin modules and
// must never appear in a 'use client' import graph.

/** Maximum upload size, in bytes. Enforced on both client (hint) and server (reject). */
export const CMS_MEDIA_UPLOAD_MAX_BYTES = 50 * 1024 * 1024

// FIX-052: single source of truth for accepted upload types. The server
// (storageUpload.ts) remains the authoritative gate — it re-verifies the MIME and
// the binary magic bytes — but the client uses this same list for the picker's
// `accept` attribute and an instant pre-check, so the UI never advertises types
// it can't take and large/wrong files are rejected before a wasted round-trip.
export const CMS_MEDIA_ALLOWED_MIME: readonly string[] = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'application/rtf',
]

/** `accept` attribute for the file picker — extensions (for the OS dialog) + MIME types. */
export const CMS_MEDIA_ACCEPT_ATTR = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf',
  '.mp4', '.webm', '.mov', '.m4v',
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.txt', '.rtf',
  ...CMS_MEDIA_ALLOWED_MIME,
].join(',')
