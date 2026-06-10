// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// import { useAuth } from '../auth/AuthContext'
// import { demoNgo } from '../lib/demo'
// import type { AuthUser } from '../auth/authTypes'

// export function RegisterPage() {
//   const navigate = useNavigate()
//   const { register } = useAuth()

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [role, setRole] = useState<AuthUser['role']>('restaurant')

//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setError(null)
//     setLoading(true)
//     try {
//       await register({
//         name,
//         email,
//         password,
//         role,
//         // demo default; restaurant can set their real location in Admin posting map
//         location: demoNgo.location,
//       })
//       navigate('/', { replace: true })
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Register failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md px-4 py-10">
//       <div className="text-2xl font-semibold tracking-tight text-slate-100">Register</div>
//       <div className="mt-1 text-sm text-slate-300">
//         Already have an account?{' '}
//         <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to="/login">
//           Login
//         </Link>
//       </div>

//       {error ? (
//         <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
//           {error}
//         </div>
//       ) : null}

//       <form
//         onSubmit={onSubmit}
//         className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5"
//       >
//         <div>
//           <label className="text-xs text-slate-300">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
//             required
//           />
//         </div>
//         <div>
//           <label className="text-xs text-slate-300">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
//             required
//           />
//         </div>
//         <div>
//           <label className="text-xs text-slate-300">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
//             required
//           />
//         </div>
//         <div>
//           <label className="text-xs text-slate-300">Role</label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value as AuthUser['role'])}
//             className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
//           >
//             <option value="restaurant">Restaurant</option>
//             <option value="ngo">NGO</option>
//             <option value="volunteer">Volunteer</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-lg bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-500"
//         >
//           {loading ? 'Creating…' : 'Create account'}
//         </button>
//       </form>
//     </div>
//   )
// }

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { demoNgo } from '../lib/demo'
import type { AuthUser } from '../auth/authTypes'

const roleConfig: Record<AuthUser['role'], { emoji: string; label: string; desc: string }> = {
  restaurant: { emoji: '🏨', label: 'Restaurant', desc: 'Post surplus food listings' },
  ngo:        { emoji: '🤝', label: 'NGO',        desc: 'Claim food for communities' },
  volunteer:  { emoji: '🙋', label: 'Volunteer',  desc: 'Help with food delivery' },
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]       = useState<AuthUser['role']>('restaurant')
  const [showPass, setShowPass] = useState(false)

  const [error, setError]     = useState<string | null>(null)
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
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .reg-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%,   rgba(52,211,153,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 10% 90%,  rgba(16,185,129,0.04) 0%, transparent 60%),
            #020814;
        }
        .reg-wrap {
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.35s ease both;
        }

        /* ── Branding strip ── */
        .reg-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .reg-brand-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 16px rgba(52,211,153,0.12);
        }
        .reg-brand-name {
          font-size: 15px;
          font-weight: 800;
          background: linear-gradient(90deg, #fff 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .reg-brand-sub {
          font-size: 11px;
          color: #475569;
          margin-top: 1px;
        }

        /* ── Card ── */
        .reg-card {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(51,65,85,0.7);
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52,211,153,0.05) 0%, transparent 65%),
            rgba(2,8,20,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 24px 64px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.04);
          padding: 32px 28px 28px;
          overflow: hidden;
        }
        /* Shimmer top line */
        .reg-card::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #34d399 40%, #6ee7b7 60%, transparent);
          background-size: 200% auto;
          animation: shimmerLine 3s linear infinite;
          opacity: 0.6;
        }

        /* ── Heading ── */
        .reg-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f1f5f9;
          margin-bottom: 4px;
        }
        .reg-sub {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 24px;
        }
        .reg-sub a {
          font-weight: 700;
          color: #818cf8;
          text-decoration: none;
          transition: color 0.15s;
        }
        .reg-sub a:hover { color: #a5b4fc; }

        /* ── Alert ── */
        .reg-alert {
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
          margin-bottom: 20px;
          animation: fadeUp 0.2s ease both;
        }

        /* ── Field ── */
        .field { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 6px;
        }
        .field-input-wrap { position: relative; }
        .field-input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(51,65,85,0.7);
          background: rgba(15,23,42,0.7);
          padding: 10px 14px;
          font-size: 13px;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
          backdrop-filter: blur(8px);
        }
        .field-input::placeholder { color: #334155; }
        .field-input:focus {
          border-color: rgba(52,211,153,0.45);
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .field-input.with-btn { padding-right: 44px; }

        /* eye toggle */
        .eye-btn {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
          color: #475569;
          padding: 0;
          line-height: 1;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #94a3b8; }

        /* ── Role picker ── */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }
        .role-tile {
          border-radius: 12px;
          border: 1px solid rgba(51,65,85,0.6);
          background: rgba(15,23,42,0.6);
          padding: 12px 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
        }
        .role-tile:hover {
          border-color: rgba(51,65,85,0.9);
          background: rgba(30,41,59,0.7);
        }
        .role-tile.selected {
          border-color: rgba(52,211,153,0.45);
          background: rgba(52,211,153,0.08);
          box-shadow: 0 0 12px rgba(52,211,153,0.1);
        }
        .role-tile-emoji { font-size: 22px; margin-bottom: 5px; }
        .role-tile-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        .role-tile.selected .role-tile-label { color: #6ee7b7; }
        .role-tile-desc {
          font-size: 9px;
          color: #475569;
          line-height: 1.3;
        }

        /* ── Submit ── */
        .submit-btn {
          width: 100%;
          border-radius: 12px;
          background: linear-gradient(135deg, #34d399, #10b981);
          border: none;
          padding: 12px;
          font-size: 14px;
          font-weight: 800;
          color: #020814;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(52,211,153,0.3);
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 0 30px rgba(52,211,153,0.5);
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          background: rgba(30,41,59,0.7);
          color: #334155;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .spin-icon { display: inline-block; animation: spin 0.8s linear infinite; margin-right: 6px; }

        /* ── Footer note ── */
        .reg-footer {
          margin-top: 18px;
          text-align: center;
          font-size: 11px;
          color: #334155;
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-wrap">

          {/* Brand */}
          <div className="reg-brand">
            <div className="reg-brand-icon">🍱</div>
            <div>
              <div className="reg-brand-name">FoodConnect</div>
              <div className="reg-brand-sub">Smart food sharing</div>
            </div>
          </div>

          {/* Card */}
          <div className="reg-card">
            <div className="reg-title">Create account</div>
            <div className="reg-sub">
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </div>

            {/* Error */}
            {error && <div className="reg-alert">⚠ {error}</div>}

            <form onSubmit={onSubmit}>
              {/* Name */}
              <div className="field">
                <label className="field-label">Full name</label>
                <div className="field-input-wrap">
                  <input
                    className="field-input"
                    placeholder="e.g. Arjun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label className="field-label">Email address</label>
                <div className="field-input-wrap">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="field-input with-btn"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass((p) => !p)}
                    tabIndex={-1}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Role picker */}
              <div className="field">
                <label className="field-label">Your role</label>
                <div className="role-grid">
                  {(Object.entries(roleConfig) as [AuthUser['role'], typeof roleConfig[AuthUser['role']]][]).map(
                    ([key, cfg]) => (
                      <div
                        key={key}
                        className={`role-tile${role === key ? ' selected' : ''}`}
                        onClick={() => setRole(key)}
                      >
                        <div className="role-tile-emoji">{cfg.emoji}</div>
                        <div className="role-tile-label">{cfg.label}</div>
                        <div className="role-tile-desc">{cfg.desc}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <><span className="spin-icon">⟳</span>Creating…</>
                  : '✨ Create account'
                }
              </button>
            </form>
          </div>

          <div className="reg-footer">
            By registering you agree to use this platform responsibly.
          </div>
        </div>
      </div>
    </>
  )
}