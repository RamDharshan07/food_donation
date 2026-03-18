import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { AdminNavbar } from './components/AdminNavbar'
import { AdminPage } from './pages/AdminPage'
import { DashboardPage } from './pages/DashboardPage'
import { FoodDetailsPage } from './pages/FoodDetailsPage'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { RegisterPage } from './pages/RegisterPage'
import { useAuth } from './auth/AuthContext'

function MainShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Outlet />
    </div>
  )
}

function AdminShell() {
  const { user, loading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminNavbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <div className="text-sm text-slate-300">Checking admin session…</div>
        ) : !user ? (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-4 max-w-md space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5"
          >
            <div className="text-lg font-semibold text-slate-100">Admin login</div>
            {error ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            ) : null}
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
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {submitting ? 'Logging in…' : 'Login as restaurant admin'}
            </button>
          </form>
        ) : user.role !== 'restaurant' ? (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            Only <span className="font-semibold">restaurant</span> accounts can access the admin page.
          </div>
        ) : (
          <AdminPage />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainShell />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/food/:id" element={<FoodDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/admin" element={<AdminShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}