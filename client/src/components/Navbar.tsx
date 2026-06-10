import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiGetListings } from '../lib/api'
import { demoNgo } from '../lib/demo'
import type { Listing } from '../lib/types'

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'relative rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
    isActive
      ? 'bg-slate-100 text-slate-950 shadow-sm'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
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
    <>
      {/* Injected styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(52,211,153,0.45); }
          70%  { box-shadow: 0 0 0 7px rgba(52,211,153,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
        }
        .navbar-root {
          position: relative;
          z-index: 50;
        }
        /* Animated top gradient line */
        .navbar-root::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 1.5px;
          background: linear-gradient(90deg,
            transparent 0%,
            #34d399 20%,
            #6ee7b7 50%,
            #34d399 80%,
            transparent 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          opacity: 0.7;
        }
        /* Bottom border with subtle glow */
        .navbar-root::after {
          content: '';
          position: absolute;
          inset: auto 0 0 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(51,65,85,0.8), transparent);
        }
        .navbar-bg {
          background: 
            radial-gradient(ellipse 60% 80% at 50% -20%, rgba(52,211,153,0.06) 0%, transparent 70%),
            rgba(2,8,20,0.82);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
        }
        .logo-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.08) 100%);
          border: 1px solid rgba(52,211,153,0.3);
          box-shadow: 0 0 16px rgba(52,211,153,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: all 0.3s ease;
          font-size: 18px;
        }
        .logo-wrap:hover .logo-icon {
          border-color: rgba(52,211,153,0.55);
          box-shadow: 0 0 24px rgba(52,211,153,0.22), inset 0 1px 0 rgba(255,255,255,0.1);
          transform: scale(1.06) rotate(-2deg);
        }
        .logo-name {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          background: linear-gradient(90deg, #fff 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s;
        }
        .logo-wrap:hover .logo-name {
          background: linear-gradient(90deg, #6ee7b7 0%, #34d399 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }
        .notif-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(51,65,85,0.8);
          color: white;
          font-size: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .notif-btn:hover {
          background: rgba(30,41,59,0.95);
          border-color: rgba(52,211,153,0.35);
          box-shadow: 0 0 12px rgba(52,211,153,0.15);
        }
        .notif-badge {
          position: absolute;
          top: -3px; right: -3px;
          min-width: 16px; height: 16px;
          padding: 0 4px;
          border-radius: 999px;
          background: linear-gradient(135deg, #34d399, #10b981);
          color: #020c1a;
          font-size: 9px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 8px rgba(52,211,153,0.6);
          animation: pulse-ring 1.8s ease-out infinite;
        }
        .notif-panel {
          position: fixed;
          top: 58px; right: 16px;
          z-index: 60;
          width: 288px;
          border-radius: 16px;
          border: 1px solid rgba(51,65,85,0.7);
          background: 
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,211,153,0.07) 0%, transparent 70%),
            rgba(2,8,20,0.96);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          padding: 14px;
          box-shadow: 
            0 24px 48px rgba(0,0,0,0.5),
            0 0 0 1px rgba(52,211,153,0.08),
            inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeSlideDown 0.22s ease forwards;
        }
        .notif-header {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(51,65,85,0.5);
        }
        .notif-item {
          border-radius: 10px;
          border: 1px solid rgba(51,65,85,0.6);
          background: rgba(15,23,42,0.6);
          padding: 8px 12px;
          transition: all 0.18s ease;
          cursor: default;
        }
        .notif-item:hover {
          background: rgba(30,41,59,0.8);
          border-color: rgba(52,211,153,0.2);
          transform: translateX(2px);
        }
        .avatar-ring {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: #020c1a;
          box-shadow: 0 0 0 2px rgba(52,211,153,0.25), 0 0 12px rgba(52,211,153,0.2);
          transition: box-shadow 0.2s;
        }
        .avatar-ring:hover {
          box-shadow: 0 0 0 2px rgba(52,211,153,0.5), 0 0 20px rgba(52,211,153,0.3);
        }
        .logout-btn {
          border-radius: 10px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #fca5a5;
          box-shadow: 0 0 12px rgba(239,68,68,0.1);
        }
        .nav-link-active-glow {
          /* extra glow for active links — applied via JS className */
        }
      `}</style>

      <div className="navbar-root">
        <div className="navbar-bg">
          <div
            style={{
              maxWidth: '1152px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
            }}
          >
            {/* ── Logo ── */}
            <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div className="logo-icon">🍱</div>
              <div>
                <div className="logo-name">FoodConnect</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                  Smart food sharing
                </div>
              </div>
            </div>

            {/* ── Right cluster ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <NavLink to="/" className={linkClass} end>
                Map
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              {/* Notifications */}
              <div style={{ position: 'relative', marginLeft: '6px' }}>
                <button
                  type="button"
                  className="notif-btn"
                  onClick={() => setNotifsOpen((o) => !o)}
                  title="New food listings (near NGO)"
                >
                  🔔
                  {notifs.length > 0 && (
                    <span className="notif-badge">{notifs.length}</span>
                  )}
                </button>

                {notifsOpen && (
                  <div className="notif-panel">
                    <div className="notif-header">📍 Nearby food · NGO</div>

                    {notifError ? (
                      <div style={{ fontSize: '11px', color: '#fca5a5' }}>{notifError}</div>
                    ) : notifs.length === 0 ? (
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        No available listings right now.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                        {notifs.map((l) => (
                          <div key={l._id} className="notif-item">
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                              {l.restaurantName || 'Hotel'}{' '}
                              <span style={{ fontWeight: 400, color: '#94a3b8' }}>· {l.foodType}</span>
                            </div>
                            {typeof l.distanceKm === 'number' && (
                              <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>
                                📌 {l.distanceKm.toFixed(2)} km away
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User */}
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                  <div className="avatar-ring" title={user.email}>
                    {letter}
                  </div>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={logout}
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
      </div>
    </>
  )
}