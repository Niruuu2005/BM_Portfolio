import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { User, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/** Must match admin email created via Dashboard or `npm run create-admin` */
const ADMIN_LOGIN_EMAIL_DOMAIN = 'bm-portfolio.org'

const formatAuthError = (error) => {
  const msg = String(error?.message || '')
  const status = error?.status
  if (status === 500 || /500|internal server error|unexpected failure/i.test(msg)) {
    return 'Sign-in failed (server error). If this user was created with SQL on auth.users, remove them in Supabase → Authentication → Users, then run: npm run create-admins'
  }
  if (/permission denied|rls|row-level security/i.test(msg)) {
    return `${msg} — Ensure your user is in public.app_admins (see docs/create_admin_user.sql).`
  }
  return msg || 'Login failed'
}

/** Supabase signs in with email; bare usernames map to @bm-portfolio.org (local part lowercased). */
const normalizeSignInEmail = (raw) => {
  const s = raw.trim()
  if (!s) return s
  if (s.includes('@')) return s.toLowerCase()
  return `${s.toLowerCase()}@${ADMIN_LOGIN_EMAIL_DOMAIN}`
}

const schema = z.object({
  username: z.string().min(1, 'Enter username or email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const LoginPage = () => {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ username, password }) => {
    setLoading(true)
    const { error } = await signIn(normalizeSignInEmail(username), password)
    setLoading(false)
    if (error) {
      toast.error(formatAuthError(error))
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">BM</div>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-sub">Use your username and password (e.g. nirruu20 or bmahalakshmi — full email also works).</p>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Username or email
            </label>
            <input {...register('username')} type="text" className="form-control" placeholder="nirruu20, bmahalakshmi, or …@bm-portfolio.org" autoComplete="username" />
            {errors.username && <p className="form-error">{errors.username.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Password
            </label>
            <input {...register('password')} type="password" className="form-control" autoComplete="current-password" />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
