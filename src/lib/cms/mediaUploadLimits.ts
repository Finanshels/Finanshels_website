// Client-safe shared constants for media uploads.
// Kept in its own file so client components (CmsMediaLibrary) can read the
// size limit without pulling firebase-admin into the browser bundle —
// persistMediaAssetUpload.ts imports server-only Firebase Admin modules and
// must never appear in a 'use client' import graph.

/** Maximum upload size, in bytes. Enforced on both client (hint) and server (reject). */
export const CMS_MEDIA_UPLOAD_MAX_BYTES = 50 * 1024 * 1024
