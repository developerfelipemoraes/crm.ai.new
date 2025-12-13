import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SystemUser } from '@/types/database'

interface AuthContextType {
  user: User | null
  systemUser: SystemUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, organizationId: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [systemUser, setSystemUser] = useState<SystemUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSystemUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('system_users')
      .select('*, organization:organizations(*)')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching system user:', error)
      return null
    }

    return data
  }

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const sysUser = await fetchSystemUser(authUser.id)
      setSystemUser(sysUser)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchSystemUser(session.user.id).then(setSystemUser)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchSystemUser(session.user.id).then(setSystemUser)
      } else {
        setSystemUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string, organizationId: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error('Failed to create user')

    const { error: userError } = await supabase
      .from('system_users')
      .insert({
        id: data.user.id,
        organization_id: organizationId,
        email,
        full_name: fullName,
        role: 'sales',
      })

    if (userError) throw userError
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSystemUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        systemUser,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
