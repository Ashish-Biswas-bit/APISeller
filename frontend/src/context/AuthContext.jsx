import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  supabase, 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  getCurrentUser,
  subscribeToAuthChanges 
} from '../lib/supabase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchProfile = useCallback(async (userId) => {
    try {
      console.log('[AuthContext] Fetching profile for user:', userId)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      )
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise])
      
      if (error) {
        console.error('[AuthContext] Profile fetch error:', error)
        // If no profile exists, create one with default role
        if (error.code === 'PGRST116') {
          console.log('[AuthContext] No profile found, creating default profile')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ id: userId, role: 'user', created_at: new Date().toISOString() }])
            .select()
            .single()
          
          if (!createError) {
            console.log('[AuthContext] Created new profile:', newProfile)
            setProfile(newProfile)
            setIsAdmin(false)
            return
          }
          console.error('[AuthContext] Failed to create profile:', createError)
        }
        throw error
      }
      
      console.log('[AuthContext] Profile loaded:', { role: data?.role, email: data?.email })
      setProfile(data)
      setIsAdmin(data?.role === 'admin')
    } catch (error) {
      console.error('[AuthContext] Error fetching profile:', error.message || error)
      setProfile(null)
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...')
        
        // Wrap in timeout to prevent hanging
        const timeoutMs = 5000
        const user = await Promise.race([
          getCurrentUser(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth init timeout')), timeoutMs)
          )
        ])
        
        console.log('[AuthContext] Current user:', user ? 'logged in' : 'not logged in')
        setUser(user)
        
        if (user) {
          await fetchProfile(user.id)
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', error.message || error)
        setUser(null)
        setProfile(null)
        setIsAdmin(false)
      } finally {
        console.log('[AuthContext] Setting loading to false')
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = subscribeToAuthChanges(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        try {
          await Promise.race([
            fetchProfile(currentUser.id),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
            )
          ])
        } catch (err) {
          console.error('[AuthContext] Profile fetch timed out:', err.message)
          setProfile(null)
          setIsAdmin(false)
        }
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabaseSignUp(email, password, metadata)
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabaseSignIn(email, password)
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabaseSignOut()
    if (!error) {
      setUser(null)
      setProfile(null)
      setIsAdmin(false)
    }
    return { error }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
