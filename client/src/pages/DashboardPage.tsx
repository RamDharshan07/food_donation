// import { useEffect, useState } from 'react'

// import { ListingCard } from '../components/ListingCard'
// import { apiGetListings } from '../lib/api'
// import { useOrigin } from '../lib/origin'
// import { useRadius } from '../lib/radius'
// import type { Listing } from '../lib/types'

// export function DashboardPage() {
//   const { mode: originMode, setMode: setOriginMode, origin, originLabel, locError, locStatus, requestMyLocation } =
//     useOrigin()
//   const { radiusKm, setRadiusKm } = useRadius(10)
//   const [listings, setListings] = useState<Listing[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   async function refresh() {
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await apiGetListings(origin, { radiusKm })
//       setListings(data.listings)
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Failed to load')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     refresh()
//   }, [])

//   useEffect(() => {
//     refresh()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [origin.latitude, origin.longitude])

//   useEffect(() => {
//     refresh()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [radiusKm])

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6">
//       <div className="flex items-end justify-between gap-3">
//         <div>
//           <div className="text-2xl font-semibold tracking-tight text-slate-100">
//             Dashboard
//           </div>
//           <div className="text-sm text-slate-300">
//             Origin: <span className="font-semibold">{originLabel}</span> · Food listings shown as
//             components/cards. Click any card to open details.
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="mr-1 flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 ring-1 ring-slate-800">
//             <button
//               type="button"
//               onClick={() => {
//                 setOriginMode('my')
//                 requestMyLocation()
//               }}
//               className={[
//                 'rounded-md px-2.5 py-1.5 text-xs font-semibold',
//                 originMode === 'my' ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
//               ].join(' ')}
//               title={locError || (locStatus === 'loading' ? 'Getting location…' : 'Use current location')}
//             >
//               My
//             </button>
//             <button
//               type="button"
//               onClick={() => setOriginMode('ngo')}
//               className={[
//                 'rounded-md px-2.5 py-1.5 text-xs font-semibold',
//                 originMode === 'ngo' ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
//               ].join(' ')}
//               title="Use NGO origin"
//             >
//               NGO
//             </button>
//           </div>
//           <div className="mr-1 flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 ring-1 ring-slate-800">
//             {[10, 12, 20, 30, 40].map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => setRadiusKm(r as 10 | 12 | 20 | 30 | 40)}
//                 className={[
//                   'rounded-md px-2.5 py-1.5 text-xs font-semibold',
//                   radiusKm === r ? 'bg-emerald-300 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
//                 ].join(' ')}
//                 title={`Show listings within ${r} km`}
//               >
//                 {r}km
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={refresh}
//             className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
//             type="button"
//           >
//             {loading ? 'Refreshing…' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {error ? (
//         <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
//           {error}
//         </div>
//       ) : null}

//       {originMode === 'my' && locStatus === 'error' ? (
//         <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
//           Couldn’t access your location, using NGO origin instead. {locError}
//         </div>
//       ) : null}

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {listings.map((l) => (
//           <ListingCard key={l._id} listing={l} />
//         ))}
//       </div>

//       {listings.length === 0 && !loading ? (
//         <div className="mt-6 text-sm text-slate-400">No listings found.</div>
//       ) : null}
//     </div>
//   )
// }

import { useEffect, useState } from 'react'

import { ListingCard } from '../components/ListingCard'
import { apiGetListings } from '../lib/api'
import { useOrigin } from '../lib/origin'
import { useRadius } from '../lib/radius'
import type { Listing } from '../lib/types'

export function DashboardPage() {
  const { mode: originMode, setMode: setOriginMode, origin, originLabel, locError, locStatus, requestMyLocation } =
    useOrigin()
  const { radiusKm, setRadiusKm } = useRadius(10)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetListings(origin, { radiusKm })
      setListings(data.listings)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin.latitude, origin.longitude])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusKm])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmerBg {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .dash-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(52,211,153,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 90% 80%, rgba(16,185,129,0.04) 0%, transparent 60%),
            #020814;
          animation: fadeUp 0.35s ease both;
        }

        .dash-inner {
          max-width: 1152px;
          margin: 0 auto;
          padding: 32px 16px 48px;
        }

        /* ── Header ── */
        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .dash-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .dash-subtitle {
          margin-top: 5px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        .dash-subtitle strong {
          color: #94a3b8;
          font-weight: 600;
        }

        /* ── Controls row ── */
        .dash-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* Segmented pill group */
        .seg-group {
          display: flex;
          align-items: center;
          gap: 2px;
          border-radius: 10px;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 3px;
          backdrop-filter: blur(8px);
        }
        .seg-btn {
          border-radius: 7px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          border: none;
          transition: all 0.18s ease;
          background: transparent;
          color: #64748b;
        }
        .seg-btn:hover:not(.seg-active) {
          background: rgba(51,65,85,0.5);
          color: #cbd5e1;
        }
        .seg-btn.seg-active-light {
          background: #f1f5f9;
          color: #020814;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .seg-btn.seg-active-emerald {
          background: linear-gradient(135deg, #34d399, #10b981);
          color: #020814;
          box-shadow: 0 0 10px rgba(52,211,153,0.35), 0 1px 4px rgba(0,0,0,0.3);
        }

        /* Refresh button */
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 10px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .refresh-btn:hover {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.35);
          color: #6ee7b7;
          box-shadow: 0 0 14px rgba(52,211,153,0.12);
        }
        .spin-icon {
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        /* ── Alerts ── */
        .alert {
          margin-top: 16px;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 12px;
          line-height: 1.5;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.25s ease both;
        }
        .alert-error {
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }
        .alert-warn {
          border: 1px solid rgba(251,191,36,0.25);
          background: rgba(245,158,11,0.08);
          color: #fde68a;
        }

        /* ── Stats bar ── */
        .stats-bar {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .stat-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          border: 1px solid rgba(51,65,85,0.5);
          background: rgba(15,23,42,0.6);
          padding: 4px 10px;
          font-size: 11px;
          color: #64748b;
          backdrop-filter: blur(6px);
        }
        .stat-chip strong {
          color: #94a3b8;
          font-weight: 700;
        }
        .stat-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
        }

        /* ── Grid ── */
        .listing-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
          animation: fadeUp 0.4s ease 0.1s both;
        }
        @media (min-width: 640px) {
          .listing-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .listing-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Empty state ── */
        .empty-state {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          animation: fadeUp 0.3s ease both;
        }
        .empty-icon {
          font-size: 40px;
          opacity: 0.25;
        }
        .empty-text {
          font-size: 13px;
          color: #475569;
        }

        /* Loading skeleton */
        .skeleton-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .skeleton-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .skeleton-card {
          border-radius: 16px;
          border: 1px solid rgba(51,65,85,0.4);
          overflow: hidden;
          background: rgba(15,23,42,0.5);
        }
        .skeleton-img {
          aspect-ratio: 16/9;
          background: linear-gradient(90deg, rgba(30,41,59,0.6) 25%, rgba(51,65,85,0.4) 50%, rgba(30,41,59,0.6) 75%);
          background-size: 200% auto;
          animation: shimmerBg 1.4s linear infinite;
        }
        .skeleton-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .skeleton-line {
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(30,41,59,0.6) 25%, rgba(51,65,85,0.4) 50%, rgba(30,41,59,0.6) 75%);
          background-size: 200% auto;
          animation: shimmerBg 1.4s linear infinite;
        }

        /* Divider */
        .dash-divider {
          margin-top: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(51,65,85,0.6), transparent);
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-inner">

          {/* ── Header ── */}
          <div className="dash-header">
            <div>
              <div className="dash-title">Dashboard</div>
              <div className="dash-subtitle">
                Origin: <strong>{originLabel}</strong> · Food listings shown as cards. Click any to view details.
              </div>
            </div>

            <div className="dash-controls">
              {/* Origin toggle */}
              <div className="seg-group">
                <button
                  type="button"
                  onClick={() => { setOriginMode('my'); requestMyLocation() }}
                  className={`seg-btn ${originMode === 'my' ? 'seg-active-light' : ''}`}
                  title={locError || (locStatus === 'loading' ? 'Getting location…' : 'Use current location')}
                >
                  📍 My
                </button>
                <button
                  type="button"
                  onClick={() => setOriginMode('ngo')}
                  className={`seg-btn ${originMode === 'ngo' ? 'seg-active-light' : ''}`}
                  title="Use NGO origin"
                >
                  🏠 NGO
                </button>
              </div>

              {/* Radius toggle */}
              <div className="seg-group">
                {[10, 12, 20, 30, 40].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadiusKm(r as 10 | 12 | 20 | 30 | 40)}
                    className={`seg-btn ${radiusKm === r ? 'seg-active-emerald' : ''}`}
                    title={`Show listings within ${r} km`}
                  >
                    {r}km
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button onClick={refresh} className="refresh-btn" type="button">
                {loading
                  ? <><span className="spin-icon">⟳</span> Refreshing…</>
                  : <>⟳ Refresh</>
                }
              </button>
            </div>
          </div>

          {/* ── Alerts ── */}
          {error && (
            <div className="alert alert-error">
              ⚠ {error}
            </div>
          )}
          {originMode === 'my' && locStatus === 'error' && (
            <div className="alert alert-warn">
              ⚠ Couldn't access your location — using NGO origin instead. {locError}
            </div>
          )}

          {/* ── Stats bar ── */}
          {!loading && listings.length > 0 && (
            <div className="stats-bar">
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#34d399' }} />
                <strong>{listings.filter(l => l.status === 'available').length}</strong> available
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#fbbf24' }} />
                <strong>{listings.filter(l => l.status === 'claimed').length}</strong> claimed
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#60a5fa' }} />
                <strong>{listings.filter(l => l.status === 'completed').length}</strong> completed
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#f87171' }} />
                <strong>{listings.filter(l => l.status === 'expired').length}</strong> expired
              </div>
              <div className="stat-chip" style={{ marginLeft: 'auto' }}>
                🗺 Within <strong>{radiusKm} km</strong>
              </div>
            </div>
          )}

          <div className="dash-divider" />

          {/* ── Skeleton loading ── */}
          {loading && listings.length === 0 && (
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ height: 14, width: '60%' }} />
                    <div className="skeleton-line" style={{ height: 11, width: '40%' }} />
                    <div className="skeleton-line" style={{ height: 11, width: '30%', marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Grid ── */}
          {!loading || listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((l) => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>
          ) : null}

          {/* ── Empty state ── */}
          {listings.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <div className="empty-text">No listings found within {radiusKm} km.</div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}