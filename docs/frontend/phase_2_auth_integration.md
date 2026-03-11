# Phase 2 — Authentication Integration

> **Phase Goal:** Implement a complete Admin authentication flow using Supabase Auth. This includes the AuthContext provider, Admin Login page, Protected Route guard, session persistence, and automatic redirects.

---

## 2.1 Understanding the Auth Architecture

```
App Start
    │
    ▼
AuthProvider (wraps entire app)
    │
    ├── Calls supabase.auth.getSession() on mount
    ├── Listens to onAuthStateChange() continuously
    └── Stores { session, user, loading } in context
                         │
            ┌────────────┴─────────────┐
            │                          │
     /admin/login               /admin/dashboard
     (Public)                   (Protected)
     Login form                     │
     → signInWithPassword()         │
     → on success → navigate →  ProtectedRoute checks
                                session → if null →
                                redirect to /admin/login
```

---

## 2.2 AuthContext — Global Auth State

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)  // true while checking session

  useEffect(() => {
    // Step 1: Get existing session from localStorage on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Step 2: Listen for any auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup listener on unmount
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!session,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return context
}
```

---

## 2.3 ProtectedRoute — Guards Admin Pages

```jsx
// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/shared/Spinner'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Show spinner while session is being checked (prevents flash)
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Authenticated — render the child route
  return <Outlet />
}

export default ProtectedRoute
```

---

## 2.4 Router Setup — Public + Protected Routes

```jsx
// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom'

// Public layouts & pages
import HomePage from '@/pages/public/HomePage'

// Admin pages
import LoginPage from '@/pages/admin/LoginPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import ProfilePage from '@/pages/admin/ProfilePage'
import EducationPage from '@/pages/admin/EducationPage'
import ExperiencePage from '@/pages/admin/ExperiencePage'
import PublicationsPage from '@/pages/admin/PublicationsPage'
import PatentsPage from '@/pages/admin/PatentsPage'
import TeachingPage from '@/pages/admin/TeachingPage'
import ActivitiesPage from '@/pages/admin/ActivitiesPage'

// Route guard
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/" element={<HomePage />} />

      {/* ==================== ADMIN ROUTES ==================== */}
      {/* Login — accessible without auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected admin routes — need auth */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="profile"      element={<ProfilePage />} />
        <Route path="education"    element={<EducationPage />} />
        <Route path="experience"   element={<ExperiencePage />} />
        <Route path="publications" element={<PublicationsPage />} />
        <Route path="patents"      element={<PatentsPage />} />
        <Route path="teaching"     element={<TeachingPage />} />
        <Route path="activities"   element={<ActivitiesPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
```

---

## 2.5 Admin Login Page

```jsx
// src/pages/admin/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already logged in, redirect immediately
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Both fields are required.')
      return
    }
    setLoading(true)
    const { error } = await signIn(formData.email, formData.password)
    setLoading(false)
    if (error) {
      setError('Invalid email or password. Please try again.')
      toast.error('Login failed.')
    } else {
      toast.success('Welcome back!')
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1>Admin Login</h1>
          <p>Sign in to manage your website content</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@youremail.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="form-error">⚠️ {error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">
          <a href="/" className="back-link">← Back to Website</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
```

### Login Page CSS
```css
/* Add to src/styles/global.css */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-6);
}

.login-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-12);
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-lg);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

.login-header h1 {
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.login-header p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.form-group input {
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.form-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}

.login-footer {
  margin-top: var(--space-6);
  text-align: center;
}

.back-link {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.back-link:hover {
  color: var(--color-accent);
  text-decoration: none;
}
```

---

## 2.6 Shared Spinner Component

```jsx
// src/components/shared/Spinner.jsx
const Spinner = ({ size = 'md' }) => {
  const sizeMap = { sm: '16px', md: '28px', lg: '48px' }
  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '3px solid var(--color-border)',
        borderTop: '3px solid var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
```

Add `@keyframes spin` to `global.css`:
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 2.7 Logout Functionality

Logout is wired into `AdminSidebar` (see Layout module). The underlying call is:

```jsx
// Used in admin sidebar/topbar
const { signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  navigate('/admin/login')
  toast.success('Logged out successfully.')
}
```

---

## 2.8 Session Persistence Notes

- Supabase automatically stores the JWT in `localStorage` under `sb-[project-id]-auth-token`.
- The `autoRefreshToken: true` option (set in `supabase.js`) keeps the session alive automatically.
- On page refresh, `getSession()` re-reads from `localStorage` — no re-login needed.
- Sessions expire after the default Supabase token lifetime (1 hour access token, ~1 week refresh token).

---

## 2.9 Phase 2 Completion Checklist

```
[ ] AuthContext.jsx created with session, user, loading states
[ ] useAuth() hook exported and working
[ ] ProtectedRoute.jsx guards all /admin/* routes
[ ] AppRouter.jsx has all public and admin routes defined
[ ] LoginPage.jsx renders properly with email/password fields
[ ] Login success → redirects to /admin/dashboard
[ ] Login failure → shows clear error message
[ ] Already-authenticated admin → bypasses login form
[ ] Page refresh → session persists (no re-login)
[ ] Sign out clears session and redirects to /admin/login
[ ] Loading spinner shows while session is being checked
```

---

*Frontend Phase 2 — Authentication | v1.0 — March 2026*
