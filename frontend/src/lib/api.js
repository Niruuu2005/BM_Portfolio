const base = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function formatDetail(detail) {
  if (detail == null) return ''
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e === 'object' && 'msg' in e ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join('; ')
  }
  return String(detail)
}

async function parseError(r) {
  const t = await r.text()
  try {
    const j = JSON.parse(t)
    const d = formatDetail(j.detail)
    return d || j.message || t || r.statusText
  } catch {
    return t || r.statusText
  }
}

/** Public read (no auth). */
export async function apiPublic(path) {
  const url = `${base()}${path.startsWith('/') ? path : `/${path}`}`
  const r = await fetch(url)
  if (!r.ok) throw new Error(await parseError(r))
  return r.json()
}

/** Admin CRUD; requires Supabase access_token. */
export async function apiAdmin(path, { token, method = 'GET', body } = {}) {
  if (!token) throw new Error('Not authenticated')
  const url = `${base()}${path.startsWith('/') ? path : `/${path}`}`
  const r = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  })
  if (!r.ok) throw new Error(await parseError(r))
  const text = await r.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
