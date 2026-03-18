import { API_BASE } from '../lib/api'
import type { AuthUser } from './authTypes'

export async function authRegister(input: {
  name: string
  email: string
  password: string
  role: AuthUser['role']
  location: { latitude: number; longitude: number }
}) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string }
  if (!res.ok) throw new Error(data?.error || 'Register failed')
  if (!data.token || !data.user) throw new Error('Invalid server response')
  return data as { token: string; user: AuthUser }
}

export async function authLogin(input: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string }
  if (!res.ok) throw new Error(data?.error || 'Login failed')
  if (!data.token || !data.user) throw new Error('Invalid server response')
  return data as { token: string; user: AuthUser }
}

export async function authMe(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = (await res.json().catch(() => ({}))) as { user?: AuthUser; error?: string }
  if (!res.ok) throw new Error(data?.error || 'Not authenticated')
  if (!data.user) throw new Error('Invalid server response')
  return data.user
}

