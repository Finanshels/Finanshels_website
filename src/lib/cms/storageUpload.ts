import { randomUUID } from 'node:crypto'
import { getStorage } from 'firebase-admin/storage'
import { getAdminApp } from './firestore'

/** Types accepted by the CMS media dropzone — keep in sync with admin UI hint text. */
const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
])

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
    throw new Error(`Unsupported type "${mime}". Use PNG, JPG, GIF, WebP, SVG, or PDF.`)
  }

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
    await file.save(params.buffer, {
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
  return { url, byteSize: params.buffer.byteLength }
}
