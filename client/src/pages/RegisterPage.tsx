import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { demoNgo } from '../lib/demo'
import type { AuthUser } from '../auth/authTypes'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AuthUser['role']>('restaurant')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({
        name,
        email,
        password,
        role,
        // demo default; restaurant can set their real location in Admin posting map
        location: demoNgo.location,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="text-2xl font-semibold tracking-tight text-slate-100">Register</div>
      <div className="mt-1 text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to="/login">
          Login
        </Link>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5"
      >
        <div>
          <label className="text-xs text-slate-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-300">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AuthUser['role'])}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="restaurant">Restaurant</option>
            <option value="ngo">NGO</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

