/**
 * Create admin user via Supabase Auth Admin API (correct password hashing).
 *
 * Why not SQL? INSERT into auth.users with pgcrypto crypt() often causes
 * signInWithPassword to return HTTP 500 — GoTrue expects its own bcrypt format.
 *
 * Usage (from frontend folder):
 *   npm run create-admin
 *
 * Requires in .env or .env.local:
 *   VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...   (Dashboard → Settings → API → service_role)
 *
 * Login: nirruu20@bm-portfolio.org (or type nirruu20 in app) / 200605
 *
 * Optional env overrides:
 *   ADMIN_EMAIL, ADMIN_PASSWORD
 * See docs/troubleshooting_auth_create_user.md if createUser fails with a database error.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const frontendRoot = join(__dirname, '..')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  let text = readFileSync(path, 'utf8')
  // UTF-8 BOM breaks the first key on Windows editors
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
    // CRLF or stray \r in value (Windows .env)
    val = val.replace(/\r$/, '').trim()
    if (!key || process.env[key] !== undefined) continue
    process.env[key] = val
  }
}

loadEnvFile(join(frontendRoot, '.env'))
loadEnvFile(join(frontendRoot, '.env.local'))

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const EMAIL = (process.env.ADMIN_EMAIL || 'nirruu20@bm-portfolio.org').trim()
const PASSWORD = (process.env.ADMIN_PASSWORD || '200605').trim()

function logAuthError(prefix, error) {
  console.error(prefix, error?.message || error)
  const bits = {
    code: error?.code,
    status: error?.status,
    name: error?.name,
  }
  const json = JSON.stringify(Object.fromEntries(Object.entries(bits).filter(([, v]) => v != null)))
  if (json !== '{}') console.error('  Details:', json)
}

if (!url || !serviceKey) {
  console.error(`
Missing env. Add to frontend/.env or frontend/.env.local:

  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret

Get the service role key from: Supabase Dashboard → Settings → API
`)
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 200 })
if (listErr) {
  logAuthError('listUsers failed:', listErr)
  process.exit(1)
}

const existing = list?.users?.find((u) => u.email?.toLowerCase() === EMAIL.toLowerCase())
if (existing) {
  const { error } = await supabase.auth.admin.deleteUser(existing.id)
  if (error) {
    logAuthError('Could not remove existing user:', error)
    process.exit(1)
  }
  console.log('Removed existing user:', EMAIL)
}

async function createAdminUser(emailConfirm) {
  return supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: emailConfirm,
    user_metadata: { role: 'admin' },
  })
}

let { data, error } = await createAdminUser(true)

// Some projects fail confirmation-related DB paths; unconfirmed user + explicit confirm often works.
if (error) {
  logAuthError('createUser (email_confirm=true) failed:', error)
  console.error('Retrying with email_confirm=false, then confirming via admin API…')
  ;({ data, error } = await createAdminUser(false))
}

if (!error && data?.user && !data.user.email_confirmed_at) {
  const { error: updErr } = await supabase.auth.admin.updateUserById(data.user.id, {
    email_confirm: true,
  })
  if (updErr) {
    logAuthError('User was created but email_confirm update failed:', updErr)
    console.error('You may still be able to sign in if “Confirm email” is off in Auth settings.')
  }
}

if (error) {
  logAuthError('createUser failed:', error)
  console.error(`
Next steps:
  1) Supabase Dashboard → Logs → Postgres Logs — find the ERROR at this timestamp.
  2) Read docs/troubleshooting_auth_create_user.md (triggers, hooks, broken users).
`)
  process.exit(1)
}

const uid = data.user?.id
if (uid) {
  const { error: admErr } = await supabase.from('app_admins').upsert(
    { user_id: uid },
    { onConflict: 'user_id' }
  )
  if (admErr) {
    logAuthError('User created but app_admins upsert failed (RLS or missing table):', admErr)
    console.error('Ensure docs/sql/001_schema.sql and 002_policies.sql were applied. Service role must bypass RLS.')
  } else {
    console.log('Registered in public.app_admins — this user can edit portfolio data.')
  }
}

console.log('OK — admin user created.')
console.log('  Email:', EMAIL)
console.log('  Password:', PASSWORD)
console.log('  Or sign in with username: nirruu20 (app adds @bm-portfolio.org)')
console.log('  User id:', uid)
