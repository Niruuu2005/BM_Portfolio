import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { apiAdmin } from '@/lib/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminRole, setAdminRole] = useState(null)
  /** false until /api/admin/me finishes (or skipped when no token). */
  const [adminMeReady, setAdminMeReady] = useState(false)

  const accessToken = session?.access_token ?? null

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!accessToken) {
      setAdminRole(null)
      setAdminMeReady(true)
      return
    }

    let cancelled = false
    setAdminMeReady(false)

    apiAdmin('/api/admin/me', { token: accessToken })
      .then((data) => {
        if (cancelled) return
        const role = data?.role === 'super' || data?.role === 'editor' ? data.role : null
        if (!role) {
          setAdminRole(null)
          setAdminMeReady(true)
          supabase.auth.signOut()
          setSession(null)
          setUser(null)
          return
        }
        setAdminRole(role)
        setAdminMeReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setAdminRole(null)
        setAdminMeReady(true)
        supabase.auth.signOut()
        setSession(null)
        setUser(null)
      })

    return () => {
      cancelled = true
    }
  }, [accessToken])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setAdminRole(null)
    setAdminMeReady(true)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!session,
        accessToken,
        adminRole,
        adminMeReady,
        adminRoleLoading: accessToken ? !adminMeReady : false,
        isSuperAdmin: adminRole === 'super',
        isTeachingEditor: adminRole === 'editor',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
