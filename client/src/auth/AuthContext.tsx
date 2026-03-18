import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthUser } from './authTypes'
import { authLogin, authMe, authRegister } from './authApi'

type AuthState = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (input: { email: string; password: string }) => Promise<void>
  register: (input: {
    name: string
    email: string
    password: string
    role: AuthUser['role']
    location: { latitude: number; longitude: number }
  }) => Promise<void>
  logout: () => void
}

const AuthCtx = createContext<AuthState | null>(null)

const LS_TOKEN = 'fd_token'
const LS_USER = 'fd_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function boot() {
      try {
        if (token) {
          const me = await authMe(token)
          setUser(me)
          localStorage.setItem(LS_USER, JSON.stringify(me))
        }
      } catch {
        setUser(null)
        setToken(null)
        localStorage.removeItem(LS_TOKEN)
        localStorage.removeItem(LS_USER)
      } finally {
        setLoading(false)
      }
    }
    boot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(input: { email: string; password: string }) {
    const res = await authLogin(input)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem(LS_TOKEN, res.token)
    localStorage.setItem(LS_USER, JSON.stringify(res.user))
  }

  async function register(input: {
    name: string
    email: string
    password: string
    role: AuthUser['role']
    location: { latitude: number; longitude: number }
  }) {
    const res = await authRegister(input)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem(LS_TOKEN, res.token)
    localStorage.setItem(LS_USER, JSON.stringify(res.user))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(LS_TOKEN)
    localStorage.removeItem(LS_USER)
  }

  const value = useMemo<AuthState>(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

