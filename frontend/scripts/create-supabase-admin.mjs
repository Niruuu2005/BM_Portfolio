/**
 * Create portfolio admin users via Supabase Auth Admin API + public.app_admins (with role).
 *
 * Usage (from frontend folder):
 *   npm run create-admins
 *   (alias: npm run create-admin — same script, creates all configured users)
 *
 * Requires:
 *   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in repo root `.env` (or `.env.local`)
 *
 * Run docs/sql/005_app_admins_role.sql on existing DBs before upserting { role }.
 *
 * Defaults:
 *   1) nirruu20@bm-portfolio.org / 200605 — role super
 *   2) bmahalakshmi@bm-portfolio.org / bmahalakshmi — role editor (teaching only in app)
 *
 * Overrides: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN2_EMAIL, ADMIN2_PASSWORD
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const frontendRoot = join(__dirname, '..')
const repoRoot = join(frontendRoot, '..')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  let text = readFileSync(path, 'utf8')
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  for (let line of text.split(/\r?\n/)) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1)
    val = val.replace(/\r$/, '').trim()
    if (!key || process.env[key] !== undefined) continue
    process.env[key] = val
  }
}

loadEnvFile(join(frontendRoot, '.env'))
loadEnvFile(join(frontendRoot, '.env.local'))

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMINS = [
  {
    email: (process.env.ADMIN_EMAIL || 'nirruu20@bm-portfolio.org').trim(),
    password: (process.env.ADMIN_PASSWORD || '200605').trim(),
    role: 'super',
  },
  {
    email: (process.env.ADMIN2_EMAIL || 'bmahalakshmi@bm-portfolio.org').trim(),
    password: (process.env.ADMIN2_PASSWORD || 'bmahalakshmi').trim(),
    role: 'editor',
  },
]

function logAuthError(prefix, error) {
  console.error(prefix, error?.message || error)
  const bits = { code: error?.code, status: error?.status, name: error?.name }
  const json = JSON.stringify(Object.fromEntries(Object.entries(bits).filter(([, v]) => v != null)))
  if (json !== '{}') console.error('  Details:', json)
}

if (!url || !serviceKey) {
  console.error(`
Missing env. Add to repo root .env (copy from .env.example):

  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
`)
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function createOneUser(email, password) {
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (listErr) {
    logAuthError('listUsers failed:', listErr)
    process.exit(1)
  }

  const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (existing) {
    const { error } = await supabase.auth.admin.deleteUser(existing.id)
    if (error) {
      logAuthError('Could not remove existing user:', error)
      process.exit(1)
    }
    console.log('Removed existing user:', email)
  }

  async function tryCreate(emailConfirm) {
    return supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: emailConfirm,
      user_metadata: { role: 'admin' },
    })
  }

  let { data, error } = await tryCreate(true)
  if (error) {
    logAuthError('createUser (email_confirm=true) failed:', error)
    console.error('Retrying with email_confirm=false…')
    ;({ data, error } = await tryCreate(false))
  }

  if (!error && data?.user && !data.user.email_confirmed_at) {
    const { error: updErr } = await supabase.auth.admin.updateUserById(data.user.id, {
      email_confirm: true,
    })
    if (updErr) logAuthError('email_confirm update failed:', updErr)
  }

  if (error) {
    logAuthError('createUser failed:', error)
    process.exit(1)
  }

  return data.user?.id
}

for (const { email, password, role } of ADMINS) {
  console.log('\n--- Creating:', email, `(${role}) ---`)
  const uid = await createOneUser(email, password)
  if (!uid) {
    console.error('No user id returned for', email)
    process.exit(1)
  }

  const { error: admErr } = await supabase.from('app_admins').upsert(
    { user_id: uid, role },
    { onConflict: 'user_id' }
  )
  if (admErr) {
    logAuthError('app_admins upsert failed:', admErr)
    console.error('If column "role" is missing, run docs/sql/005_app_admins_role.sql in Supabase SQL Editor.')
    process.exit(1)
  }
  console.log('Registered in app_admins with role:', role)
  console.log('  User id:', uid)
}

console.log('\nOK — all admin users created.')
console.log('Sign in at /admin/login (username without @ uses @bm-portfolio.org).')
