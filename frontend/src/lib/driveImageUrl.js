/**
 * Google Drive sharing links are not valid as <img src>.
 * Converts file links to uc?export=view for public "anyone with link" files.
 */
const DRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/

export function normalizeDriveImageUrl(url) {
  if (!url || typeof url !== 'string') return null
  const t = url.trim()
  if (!t) return null
  const m = t.match(DRIVE_FILE_RE)
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`
  if (/^https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/.test(t)) {
    const id = new URL(t).searchParams.get('id')
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`
  }
  return null
}

/** Use direct image URL if Drive, else original (e.g. Supabase Storage HTTPS). */
export function profileImageSrc(url) {
  if (!url) return null
  return normalizeDriveImageUrl(url) || url
}
