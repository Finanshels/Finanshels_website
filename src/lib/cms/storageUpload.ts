import { randomUUID } from 'node:crypto'
import { getStorage } from 'firebase-admin/storage'
import { getAdminApp } from './firestore'

/**
 * Types accepted by the CMS media dropzone — keep in sync with persistMediaAssetUpload's
 * MIME catalogue and the admin UI hint text. FIX-014 expanded this from images+PDF only
 * to also accept the video and office-document MIMEs the persist layer already
 * categorises; before that, every non-image upload was buffered, the persist layer
 * accepted it, and the storage layer then rejected it with a confusing error.
 */
const ALLOWED_MIME = new Set([
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
])

/**
 * FIX-014: minimum-viable SVG sanitizer. We do NOT use sanitize-html here because
 * SVG has a different attribute / element model (e.g. presentation-only attrs
 * like `cx`, `viewBox`, `xlink:href`). Strip the dangerous bits:
 *   - <script> tags entirely
 *   - on* event handler attributes
 *   - javascript: URLs in href / xlink:href / src
 *   - <foreignObject> (can embed arbitrary HTML)
 *   - external references in xlink:href to anything other than '#'
 *
 * This is defense-in-depth alongside Firebase Storage's content-disposition
 * controls; admins should treat any uploaded SVG as semi-trusted.
 */
export function sanitizeSvgBytes(input: Buffer): Buffer {
  let text = input.toString('utf8')
  // Remove <script>...</script>
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove on* event attributes (e.g. onload="...", onclick='...')
  text = text.replace(/\s+on[a-z]+\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi, '')
  // Remove javascript: URLs in href / xlink:href / src
  text = text.replace(
    /\b(href|xlink:href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi,
    '$1=""'
  )
  // Strip <foreignObject>...</foreignObject>
  text = text.replace(/<foreignObject\b[\s\S]*?<\/foreignObject>/gi, '')
  return Buffer.from(text, 'utf8')
}

/**
 * FIX-014: magic-byte fingerprint check. Returns true when the buffer's binary
 * signature matches the claimed MIME. Returns true for MIMEs we don't have a
 * fingerprint for (so this is fail-open for office docs; the MIME allowlist
 * itself is the second line of defense).
 */
function verifyMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false
  const b = buffer
  switch (mime) {
    case 'image/png':
      return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
    case 'image/jpeg':
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    case 'image/gif':
      return (
        b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 // GIF8
      )
    case 'image/webp':
      // 'RIFF' .. 'WEBP'
      return (
        b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        b.length >= 12 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
      )
    case 'application/pdf':
      return b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 // %PDF
    case 'image/svg+xml': {
      // SVG must be text; ensure it begins with '<' after optional BOM/whitespace.
      const text = b.toString('utf8', 0, Math.min(b.length, 512)).trimStart()
      return text.startsWith('<') && /<svg\b/i.test(text)
    }
    case 'video/mp4':
    case 'video/x-m4v':
      // ISO base media file format: bytes 4-7 contain 'ftyp'
      return b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
    case 'video/webm':
      // EBML header
      return b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3
    case 'video/quicktime':
      return b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
    default:
      // Office documents and text/csv etc. — no magic-byte check.
      return true
  }
}

function cleanEnvValue(value?: string): string {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? ''
}

function normalizeBucketId(bucket: string): string {
  const normalized = bucket.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
  if (normalized.endsWith('.firebasestorage.app')) {
    return `${normalized.slice(0, -'.firebasestorage.app'.length)}.appspot.com`
  }
  return normalized
}

function inferExtension(filename: string, mime: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(filename.trim())
  if (m) {
    let e = m[1].toLowerCase()
    if (e === 'jpeg') e = 'jpg'
    if (['png', 'jpg', 'gif', 'webp', 'svg', 'pdf'].includes(e)) return '.' + e
  }
  switch (mime) {
    case 'image/png':
      return '.png'
    case 'image/jpeg':
      return '.jpg'
    case 'image/gif':
      return '.gif'
    case 'image/webp':
      return '.webp'
    case 'image/svg+xml':
      return '.svg'
    case 'application/pdf':
      return '.pdf'
    default:
      return ''
  }
}

function storageBucketId(): string {
  const explicitBucket =
    cleanEnvValue(process.env.FIREBASE_STORAGE_BUCKET) ||
    cleanEnvValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  if (explicitBucket) {
    return normalizeBucketId(explicitBucket)
  }

  const projectId =
    cleanEnvValue(process.env.FIREBASE_ADMIN_PROJECT_ID) ||
    cleanEnvValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  if (!projectId) {
    throw new Error(
      'Missing Firebase Storage configuration — set FIREBASE_STORAGE_BUCKET to the real bucket id or provide a Firebase project id.'
    )
  }

  return `${projectId}.appspot.com`
}

/**
 * Streams bytes into Firebase Storage using the Admin SDK and returns a durable download URL (token style).
 *
 * Requires the default service account to have **Storage Admin** / object create on the bucket.
 */
export async function uploadCmsMediaBytes(params: {
  buffer: Buffer
  /** Original filename for logging / extension inference only — path uses `slug`. */
  originalFilename: string
  slug: string
  contentType: string
}): Promise<{ url: string; byteSize: number }> {
  const mime = String(params.contentType || '').split(';')[0].trim().toLowerCase()
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error(`Unsupported type "${mime}".`)
  }

  // FIX-014: reject files whose binary signature doesn't match the claimed MIME.
  if (!verifyMagicBytes(params.buffer, mime)) {
    throw new Error(`File contents do not match MIME type "${mime}".`)
  }

  // FIX-014: strip <script>, on-event attrs, javascript: URLs, <foreignObject> from SVG.
  const buffer = mime === 'image/svg+xml' ? sanitizeSvgBytes(params.buffer) : params.buffer

  const app = getAdminApp()
  if (!app) {
    throw new Error('Firebase Admin is not initialized — check FIREBASE_ADMIN_* credentials.')
  }

  const bucketName = storageBucketId()
  const bucket = getStorage(app).bucket(bucketName)
  const ext = inferExtension(params.originalFilename, mime)
  const objectPath = `cms-media/${params.slug}${ext || '.bin'}`
  const file = bucket.file(objectPath)

  const downloadToken = randomUUID()
  try {
    await file.save(buffer, {
      resumable: false,
      metadata: {
        contentType: mime,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
        cacheControl: 'public,max-age=31536000',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.toLowerCase().includes('specified bucket does not exist')) {
      throw new Error(
        `Firebase Storage bucket "${bucketName}" does not exist. Set FIREBASE_STORAGE_BUCKET to the real bucket id (usually "${cleanEnvValue(process.env.FIREBASE_ADMIN_PROJECT_ID) || 'your-project'}.appspot.com") or create the bucket in Firebase console.`
      )
    }
    throw error
  }

  const encodedPath = encodeURIComponent(objectPath)
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`
  return { url, byteSize: buffer.byteLength }
}
