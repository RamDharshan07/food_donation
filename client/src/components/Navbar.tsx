import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiGetListings } from '../lib/api'
import { demoNgo } from '../lib/demo'
import type { Listing } from '../lib/types'

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-semibold transition',
    isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
  ].join(' ')
}

export function Navbar() {
  const { user, logout } = useAuth()
  const letter = user?.email?.trim()?.[0]?.toUpperCase() || null
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [notifs, setNotifs] = useState<Listing[]>([])
  const [notifError, setNotifError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await apiGetListings(demoNgo.location, { radiusKm: 5000 })
        if (cancelled) return
        const available = data.listings.filter((l) => l.status === 'available')
        setNotifs(available)
        setNotifError(null)
      } catch (e) {
        if (cancelled) return
        setNotifError(e instanceof Error ? e.message : 'Failed to load notifications')
      }
    }

    load()
    const id = window.setInterval(load, 15000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-400/40">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-emerald-300"
            >
              <path
                fill="currentColor"
                d="M6.5 3C5.67 3 5 3.67 5 4.5v7a1 1 0 0 0 2 0V9h.5v2.5a1 1 0 0 0 2 0v-7C9.5 3.67 8.83 3 8 3s-1.5.67-1.5 1.5V7H6.5V4.5C6.5 3.67 5.83 3 5 3Zm8.75 0a1 1 0 0 0-1 1v5.25a3.25 3.25 0 1 0 2 0V4a1 1 0 0 0-1-1Zm3.25 9c-.55 0-1 .45-1 1v2.25a3.75 3.75 0 1 0 2 0V13a1 1 0 0 0-1-1Z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-100">
              Food Donation
            </div>
            <div className="text-xs text-slate-400">Connect surplus food to NGOs</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Map
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setNotifsOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-100 hover:bg-slate-800"
              title="New food listings (near NGO)"
            >
              N
              {notifs.length > 0 ? (
                <span className="ml-0.5 rounded-full bg-emerald-400 px-1 text-[9px] font-bold text-slate-950">
                  {notifs.length}
                </span>
              ) : null}
            </button>
            {notifsOpen ? (
              <div className="fixed top-14 right-4 z-50 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-lg">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Nearby food (NGO)
                </div>
                {notifError ? (
                  <div className="text-[11px] text-red-300">{notifError}</div>
                ) : notifs.length === 0 ? (
                  <div className="text-[11px] text-slate-400">No available listings right now.</div>
                ) : (
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {notifs.map((l) => (
                      <div
                        key={l._id}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-[11px]"
                      >
                        <div className="font-semibold">
                          {l.restaurantName || 'Hotel'}{' '}
                          <span className="font-normal text-slate-300">· {l.foodType}</span>
                        </div>
                        {typeof l.distanceKm === 'number' ? (
                          <div className="text-[10px] text-slate-400">
                            {l.distanceKm.toFixed(2)} km from NGO
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <div
                title={user.email}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-950"
              >
                {letter}
              </div>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                type="button"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

