import { reserveUnusedMediaSlug, type CmsMediaAssetType, upsertCmsDocument } from './collectionRepository'
import { slugifyForCms } from './slugify'
import { uploadCmsMediaBytes } from './storageUpload'
// Re-export so any server-side caller of the existing API path keeps working.
// New code should import from './mediaUploadLimits' directly to stay
// client-safe; this module imports firebase-admin transitively.
export { CMS_MEDIA_UPLOAD_MAX_BYTES } from './mediaUploadLimits'
import { CMS_MEDIA_UPLOAD_MAX_BYTES } from './mediaUploadLimits'

/** Works with `File` from the browser FormData payload (server or client). */
export type ReadableUploadFile = Pick<File, 'name' | 'size' | 'type'> & {
  arrayBuffer(): Promise<ArrayBuffer>
}

const MIME_BY_EXTENSION = new Map([
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['gif', 'image/gif'],
  ['webp', 'image/webp'],
  ['svg', 'image/svg+xml'],
  ['mp4', 'video/mp4'],
  ['webm', 'video/webm'],
  ['mov', 'video/quicktime'],
  ['m4v', 'video/x-m4v'],
  ['pdf', 'application/pdf'],
  ['doc', 'application/msword'],
  ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['xls', 'application/vnd.ms-excel'],
  ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['ppt', 'application/vnd.ms-powerpoint'],
  ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['csv', 'text/csv'],
  ['txt', 'text/plain'],
  ['rtf', 'application/rtf'],
])

const DOCUMENT_MIME_TYPES = new Set<string>([
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

export type PersistMediaAssetUploadOptions = {
  category?: string | null
  folder?: string | null
}

function extensionFor(name: string): string {
  const base = name.replace(/[/\\]+$/, '').split(/[/\\]/).pop() ?? ''
  const ext = base.includes('.') ? base.split('.').pop() : ''
  return ext?.toLowerCase() ?? ''
}

export function inferUploadedMediaMime(name: string, reportedType: string): string {
  const t = reportedType.split(';')[0]?.trim()?.toLowerCase() ?? ''
  if (t && t !== 'application/octet-stream') return t
  return MIME_BY_EXTENSION.get(extensionFor(name)) ?? ''
}

function inferUploadedMediaAssetType(contentType: string, name: string): CmsMediaAssetType {
  const mime = contentType.toLowerCase()
  const extMime = MIME_BY_EXTENSION.get(extensionFor(name))
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (DOCUMENT_MIME_TYPES.has(mime) || mime.startsWith('text/')) return 'document'
  if (extMime?.startsWith('image/')) return 'image'
  if (extMime?.startsWith('video/')) return 'video'
  if (extMime && DOCUMENT_MIME_TYPES.has(extMime)) return 'document'
  return 'other'
}

function cleanMetadataText(value: string | null | undefined, fallback: string, maxLength = 80): string {
  const clean = value?.trim().replace(/\s+/g, ' ')
  return clean ? clean.slice(0, maxLength) : fallback
}

function cleanFolderPath(value: string | null | undefined): string {
  const clean = value
    ?.trim()
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
    .replace(/\s+/g, ' ')
  return clean ? clean.slice(0, 120) : 'Root'
}

export function filenameHumanTitle(name: string): string {
  const base = name.replace(/[/\\]+$/, '').split(/[/\\]/).pop() ?? ''
  const noExt = base.replace(/\.[^.]+$/, '').trim()
  const spaced = noExt.replace(/[_-]+/g, ' ').trim()
  return spaced || 'Untitled asset'
}

/**
 * Validates, uploads to Firebase Storage, and persists a Firestore `media_assets` doc.
 * Does not touch cache tags — callers should run `revalidatePath` when appropriate.
 */
export async function persistMediaAssetUpload(
  file: ReadableUploadFile,
  updatedByRole: string,
  options: PersistMediaAssetUploadOptions = {}
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!(file.size > 0)) {
      return { ok: false, error: 'Empty file.' }
    }
    if (file.size > CMS_MEDIA_UPLOAD_MAX_BYTES) {
      const mb = Math.round(CMS_MEDIA_UPLOAD_MAX_BYTES / (1024 * 1024))
      return { ok: false, error: `Maximum file size is ${mb} MB.` }
    }

    const contentType = inferUploadedMediaMime(file.name, file.type) || file.type || 'application/octet-stream'
    const assetType = inferUploadedMediaAssetType(contentType, file.name)
    if (assetType === 'other') {
      return { ok: false, error: 'Unsupported file type. Upload images, videos, PDFs, or common office documents.' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const baseName =
      slugifyForCms(filenameHumanTitle(file.name)) ||
      slugifyForCms(file.name.replace(/\.[^.]+$/, '')) ||
      'upload'
    const slug = await reserveUnusedMediaSlug(baseName)

    const { url } = await uploadCmsMediaBytes({
      buffer,
      originalFilename: file.name || 'upload',
      slug,
      contentType,
    })

    const title = filenameHumanTitle(file.name)

    await upsertCmsDocument(
      'media_assets',
      slug,
      {
        slug,
        title,
        assetUrl: url,
        assetType,
        category: cleanMetadataText(options.category, 'General'),
        folder: cleanFolderPath(options.folder),
        mimeType: contentType,
        byteSize: buffer.byteLength,
        status: 'published',
        altText: title,
        language: 'en',
      },
      updatedByRole
    )

    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed.'
    return { ok: false, error: msg }
  }
}
