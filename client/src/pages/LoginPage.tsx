// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// import { useAuth } from '../auth/AuthContext'

// export function LoginPage() {
//   const navigate = useNavigate()
//   const { login } = useAuth()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setError(null)
//     setLoading(true)
//     try {
//       await login({ email, password })
//       navigate('/', { replace: true })
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md px-4 py-10">
//       <div className="text-2xl font-semibold tracking-tight text-slate-100">Login</div>
//       <div className="mt-1 text-sm text-slate-300">
//         Don’t have an account?{' '}
//         <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to="/register">
//           Register
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
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-lg bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-500"
//         >
//           {loading ? 'Logging in…' : 'Login'}
//         </button>
//       </form>
//     </div>
//   )
// }

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background:
            radial-gradient(ellipse 70% 55% at 50% 0%,   rgba(52,211,153,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 35% 25% at 15% 85%,  rgba(16,185,129,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 30% 20% at 85% 20%,  rgba(52,211,153,0.03) 0%, transparent 60%),
            #020814;
          position: relative;
          overflow: hidden;
        }

        /* Decorative floating orb */
        .login-orb {
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: floatOrb 7s ease-in-out infinite;
          pointer-events: none;
        }

        .login-wrap {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.35s ease both;
        }

        /* ── Brand ── */
        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          justify-content: center;
        }
        .login-brand-icon {
          width: 42px; height: 42px;
          border-radius: 13px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 21px;
          box-shadow: 0 0 20px rgba(52,211,153,0.14);
        }
        .login-brand-text { text-align: left; }
        .login-brand-name {
          font-size: 15px;
          font-weight: 800;
          background: linear-gradient(90deg, #fff 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .login-brand-sub {
          font-size: 11px;
          color: #475569;
          margin-top: 1px;
        }

        /* ── Card ── */
        .login-card {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(51,65,85,0.7);
          background:
            radial-gradient(ellipse 90% 55% at 50% 0%, rgba(52,211,153,0.05) 0%, transparent 65%),
            rgba(2,8,20,0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 28px 72px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.02),
            inset 0 1px 0 rgba(255,255,255,0.05);
          padding: 32px 28px 28px;
          overflow: hidden;
        }
        .login-card::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #34d399 40%, #6ee7b7 60%, transparent);
          background-size: 200% auto;
          animation: shimmerLine 3s linear infinite;
          opacity: 0.65;
        }

        /* ── Heading ── */
        .login-title {
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f1f5f9;
          margin-bottom: 4px;
        }
        .login-sub {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 26px;
        }
        .login-sub a {
          font-weight: 700;
          color: #818cf8;
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-sub a:hover { color: #a5b4fc; }

        /* ── Alert ── */
        .login-alert {
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
          margin-bottom: 20px;
          animation: fadeUp 0.2s ease both;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── Fields ── */
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
        }
        .field-input::placeholder { color: #334155; }
        .field-input:focus {
          border-color: rgba(52,211,153,0.45);
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .field-input.with-btn { padding-right: 44px; }

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
          box-shadow: 0 0 20px rgba(52,211,153,0.28);
          letter-spacing: 0.01em;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 0 32px rgba(52,211,153,0.48);
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          background: rgba(30,41,59,0.7);
          color: #334155;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .spin-icon { display: inline-block; animation: spin 0.8s linear infinite; }

        /* ── Footer ── */
        .login-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #1e293b;
        }

        /* ── Divider ── */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 0;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(51,65,85,0.5);
        }
        .login-divider-text {
          font-size: 10px;
          color: #334155;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="login-page">
        <div className="login-orb" />

        <div className="login-wrap">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">🍱</div>
            <div className="login-brand-text">
              <div className="login-brand-name">FoodConnect</div>
              <div className="login-brand-sub">Smart food sharing</div>
            </div>
          </div>

          {/* Card */}
          <div className="login-card">
            <div className="login-title">Welcome back 👋</div>
            <div className="login-sub">
              Don't have an account?{' '}
              <Link to="/register">Register</Link>
            </div>

            {error && (
              <div className="login-alert">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
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

              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <><span className="spin-icon">⟳</span> Logging in…</>
                  : <>🔑 Login</>
                }
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <div className="login-divider-text">or</div>
              <div className="login-divider-line" />
            </div>

            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: '#475569' }}>
              New here?{' '}
              <Link to="/register" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
                Create a free account →
              </Link>
            </div>
          </div>

          <div className="login-footer">
            FoodConnect · Connecting surplus food to communities
          </div>
        </div>
      </div>
    </>
  )
}