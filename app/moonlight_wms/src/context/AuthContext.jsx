import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

// Simple client-side password hashing simulation (SHA-256 via Web Crypto)
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'moonlight_salt_v1')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const ROLE_HOME = {
  Admin: '/admin/dashboard',
  'Site Manager': '/sm/dashboard',
  Manager: '/dashboard',
}

const ROLE_ALLOWED_PREFIXES = {
  Admin: ['/admin'],
  'Site Manager': ['/sm'],
  Manager: ['/dashboard', '/products', '/categories', '/suppliers', '/inventory', '/batches', '/movements', '/zones', '/alerts', '/notifications', '/reports', '/audit', '/settings'],
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = sessionStorage.getItem('moonlight_auth')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = useCallback(async (userData) => {
    const session = {
      ...userData,
      sessionId: crypto.randomUUID(),
      loginAt: Date.now(),
    }
    sessionStorage.setItem('moonlight_auth', JSON.stringify(session))
    setAuth(session)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('moonlight_auth')
    setAuth(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    setAuth(prev => {
      const next = { ...prev, ...updates }
      sessionStorage.setItem('moonlight_auth', JSON.stringify(next))
      return next
    })
  }, [])

  const canAccess = useCallback((path) => {
    if (!auth) return false
    const allowed = ROLE_ALLOWED_PREFIXES[auth.role] || []
    return allowed.some(prefix => path.startsWith(prefix))
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateProfile, canAccess, ROLE_HOME }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
