// import { useAuth } from '../auth/AuthContext'

// export function AdminNavbar() {
//   const { user, logout } = useAuth()
//   const letter = user?.email?.trim()?.[0]?.toUpperCase() || null

//   return (
//     <div className="border-b border-slate-800 bg-slate-950/85 backdrop-blur">
//       <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-400/40">
//             <svg
//               aria-hidden="true"
//               viewBox="0 0 24 24"
//               className="h-5 w-5 text-emerald-300"
//             >
//               <path
//                 fill="currentColor"
//                 d="M4 6.5C4 5.12 5.12 4 6.5 4h11a1 1 0 0 1 .8 1.6L17 8l1.3 2.4A1 1 0 0 1 17.4 12H6.5A2.5 2.5 0 0 1 4 9.5Zm2.5 7.5A2.5 2.5 0 0 0 4 16.5v.25A2.25 2.25 0 0 0 6.25 19h11.5A2.25 2.25 0 0 0 20 16.75V16.5A2.5 2.5 0 0 0 17.5 14Z"
//               />
//             </svg>
//           </div>
//           <div>
//             <div className="text-sm font-semibold tracking-tight text-slate-100">
//               Food Donation — Admin
//             </div>
//             <div className="text-xs text-slate-400">Post surplus food from restaurants</div>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {user ? (
//             <>
//               <div
//                 title={user.email}
//                 className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-950"
//               >
//                 {letter}
//               </div>
//               <button
//                 onClick={logout}
//                 className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
//                 type="button"
//               >
//                 Logout
//               </button>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   )
// }

import { useAuth } from '../auth/AuthContext'

export function AdminNavbar() {
  const { user, logout } = useAuth()
  const letter = user?.email?.trim()?.[0]?.toUpperCase() || null

  return (
    <>
      <style>{`
        @keyframes shimmerAdmin {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .admin-nav-root {
          position: relative;
          z-index: 50;
        }
        .admin-nav-root::before {
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
          animation: shimmerAdmin 3s linear infinite;
          opacity: 0.65;
        }
        .admin-nav-root::after {
          content: '';
          position: absolute;
          inset: auto 0 0 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(51,65,85,0.7), transparent);
        }
        .admin-nav-bg {
          background:
            radial-gradient(ellipse 60% 80% at 50% -20%, rgba(52,211,153,0.05) 0%, transparent 70%),
            rgba(2,8,20,0.82);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
        }
        .admin-nav-inner {
          max-width: 1024px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
        }

        /* ── Logo ── */
        .admin-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.08) 100%);
          border: 1px solid rgba(52,211,153,0.3);
          box-shadow: 0 0 16px rgba(52,211,153,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .admin-logo-name {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
          background: linear-gradient(90deg, #fff 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .admin-logo-sub {
          font-size: 11px;
          color: #64748b;
          margin-top: 1px;
        }
        /* Admin badge */
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #34d399;
          vertical-align: middle;
          position: relative;
          top: -1px;
        }

        /* ── Right cluster ── */
        .admin-nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-user-email {
          font-size: 11px;
          color: #475569;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .admin-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: #020814;
          box-shadow: 0 0 0 2px rgba(52,211,153,0.25), 0 0 12px rgba(52,211,153,0.18);
          transition: box-shadow 0.2s;
          flex-shrink: 0;
        }
        .admin-avatar:hover {
          box-shadow: 0 0 0 2px rgba(52,211,153,0.5), 0 0 20px rgba(52,211,153,0.3);
        }
        .admin-logout-btn {
          border-radius: 10px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .admin-logout-btn:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.35);
          color: #fca5a5;
          box-shadow: 0 0 12px rgba(239,68,68,0.08);
        }
      `}</style>

      <div className="admin-nav-root">
        <div className="admin-nav-bg">
          <div className="admin-nav-inner">

            {/* ── Logo ── */}
            <div className="admin-logo-wrap">
              <div className="admin-logo-icon">
                <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: 20, height: 20, color: '#34d399' }}>
                  <path
                    fill="currentColor"
                    d="M4 6.5C4 5.12 5.12 4 6.5 4h11a1 1 0 0 1 .8 1.6L17 8l1.3 2.4A1 1 0 0 1 17.4 12H6.5A2.5 2.5 0 0 1 4 9.5Zm2.5 7.5A2.5 2.5 0 0 0 4 16.5v.25A2.25 2.25 0 0 0 6.25 19h11.5A2.25 2.25 0 0 0 20 16.75V16.5A2.5 2.5 0 0 0 17.5 14Z"
                  />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="admin-logo-name">FoodConnect</span>
                  <span className="admin-badge">⚙ Admin</span>
                </div>
                <div className="admin-logo-sub">Post surplus food from restaurants</div>
              </div>
            </div>

            {/* ── Right ── */}
            {user && (
              <div className="admin-nav-right">
                <span className="admin-user-email">{user.email}</span>
                <div className="admin-avatar" title={user.email}>{letter}</div>
                <button
                  type="button"
                  className="admin-logout-btn"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}