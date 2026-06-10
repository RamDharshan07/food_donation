// import { useEffect, useMemo, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'

// import { apiClaimListing, apiGetListingById } from '../lib/api'
// import { useAuth } from '../auth/AuthContext'
// import { resolveImageUrl } from '../lib/images'
// import { formatTimeLeft } from '../lib/time'
// import type { Listing } from '../lib/types'

// export function FoodDetailsPage() {
//   const { id } = useParams<{ id: string }>()
//   const listingId = id || ''

//   const [listing, setListing] = useState<Listing | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { user } = useAuth()

//   async function refresh() {
//     if (!listingId) return
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await apiGetListingById(listingId)
//       setListing(data.listing)
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Failed to load')
//       setListing(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     refresh()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [listingId])

//   const timeLeft = useMemo(() => {
//     if (!listing) return null
//     return formatTimeLeft(listing.expiryTime)
//   }, [listing])

//   async function onClaim() {
//     if (!listing) return
//     if (!user || user.role !== 'ngo') {
//       setError('Please login as an NGO account to claim food.')
//       return
//     }
//     setError(null)
//     try {
//       await apiClaimListing({
//         listingId: listing._id,
//         claimedBy: user._id,
//         claimedByName: user.name,
//       })
//       await refresh()
//     } catch (e2) {
//       setError(e2 instanceof Error ? e2.message : 'Failed to claim')
//     }
//   }

//   return (
//     <div className="mx-auto max-w-4xl px-4 py-6">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <div className="text-2xl font-semibold tracking-tight text-slate-100">Food details</div>
//           <div className="text-sm text-slate-300">
//             <span className="font-mono">{listingId}</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Link
//             to="/dashboard"
//             className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
//           >
//             Back to dashboard
//           </Link>
//           <Link
//             to="/"
//             className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
//           >
//             Back to map
//           </Link>
//         </div>
//       </div>

//       {error ? (
//         <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
//           {error}
//         </div>
//       ) : null}

//       {loading && !listing ? (
//         <div className="mt-6 text-sm text-slate-400">Loading…</div>
//       ) : null}

//       {listing ? (
//         <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
//           <div className="aspect-[16/7] bg-slate-900">
//             {resolveImageUrl(listing.imageUrl) ? (
//               <img
//                 src={resolveImageUrl(listing.imageUrl) || undefined}
//                 alt={listing.foodType}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <div className="flex h-full items-center justify-center text-sm text-slate-400">
//                 No image
//               </div>
//             )}
//           </div>
//           <div className="p-5">
//             <div className="flex flex-col gap-1">
//               <div className="text-xl font-semibold text-slate-100">{listing.foodType}</div>
//               <div className="text-sm text-slate-300">
//                 Hotel: <span className="font-semibold">{listing.restaurantName || 'Restaurant'}</span>
//               </div>
//               <div className="text-sm text-slate-300">
//                 Quantity: <span className="font-semibold">{listing.quantity}</span> meals
//               </div>
//               <div className="text-sm text-slate-300">
//                 Status: <span className="font-semibold">{listing.status}</span>
//               </div>
//               <div className="text-sm text-slate-300">
//                 Expires in: <span className="font-semibold">{timeLeft}</span>
//               </div>
//               {typeof listing.distanceKm === 'number' ? (
//                 <div className="text-sm text-slate-300">
//                   Distance: <span className="font-semibold">{listing.distanceKm.toFixed(2)} km</span>
//                 </div>
//               ) : null}
//               <div className="text-sm text-slate-400">
//                 Location: ({listing.location.latitude.toFixed(4)}, {listing.location.longitude.toFixed(4)})
//               </div>
//             </div>

//             <div className="mt-4 flex items-center gap-2">
//               <button
//                 disabled={listing.status !== 'available'}
//                 onClick={onClaim}
//                 className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
//                 type="button"
//               >
//                 Claim
//               </button>
//               <button
//                 onClick={refresh}
//                 className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
//                 type="button"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { apiClaimListing, apiGetListingById } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { resolveImageUrl } from '../lib/images'
import { formatTimeLeft } from '../lib/time'
import type { Listing } from '../lib/types'

const statusConfig: Record<
  Listing['status'],
  { color: string; bg: string; border: string; glow: string; emoji: string }
> = {
  available: {
    color: '#6ee7b7', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)',
    glow: 'rgba(52,211,153,0.18)', emoji: '🟢',
  },
  claimed: {
    color: '#fcd34d', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)',
    glow: 'rgba(251,191,36,0.15)', emoji: '🟡',
  },
  completed: {
    color: '#93c5fd', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)',
    glow: 'rgba(96,165,250,0.15)', emoji: '🔵',
  },
  expired: {
    color: '#fca5a5', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)',
    glow: 'rgba(248,113,113,0.12)', emoji: '🔴',
  },
}

export function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const listingId = id || ''

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  async function refresh() {
    if (!listingId) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetListingById(listingId)
      setListing(data.listing)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
      setListing(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId])

  const timeLeft = useMemo(() => {
    if (!listing) return null
    return formatTimeLeft(listing.expiryTime)
  }, [listing])

  async function onClaim() {
    if (!listing) return
    if (!user || user.role !== 'ngo') {
      setError('Please login as an NGO account to claim food.')
      return
    }
    setError(null)
    try {
      await apiClaimListing({
        listingId: listing._id,
        claimedBy: user._id,
        claimedByName: user.name,
      })
      await refresh()
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Failed to claim')
    }
  }

  const sc = listing ? statusConfig[listing.status] ?? statusConfig.expired : null

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .details-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(52,211,153,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 35% 25% at 85% 85%, rgba(16,185,129,0.03) 0%, transparent 60%),
            #020814;
          animation: fadeUp 0.3s ease both;
        }
        .details-inner {
          max-width: 896px;
          margin: 0 auto;
          padding: 28px 16px 64px;
        }

        /* ── Header ── */
        .details-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .details-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .details-id {
          margin-top: 5px;
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.04em;
        }
        .back-btns {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 10px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.18s ease;
          backdrop-filter: blur(8px);
        }
        .back-btn:hover {
          background: rgba(51,65,85,0.7);
          border-color: rgba(100,116,139,0.5);
          color: #f1f5f9;
        }

        /* ── Alert ── */
        .alert {
          margin-top: 14px;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 12px;
          line-height: 1.5;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.25s ease both;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }

        /* ── Skeleton ── */
        .skeleton-wrap {
          margin-top: 24px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(51,65,85,0.4);
          background: rgba(15,23,42,0.5);
          animation: fadeUp 0.3s ease both;
        }
        .skeleton-img {
          aspect-ratio: 16/7;
          background: linear-gradient(90deg, rgba(30,41,59,0.6) 25%, rgba(51,65,85,0.4) 50%, rgba(30,41,59,0.6) 75%);
          background-size: 200% auto;
          animation: shimmerSweep 1.4s linear infinite;
        }
        .skeleton-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skeleton-line {
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(30,41,59,0.6) 25%, rgba(51,65,85,0.4) 50%, rgba(30,41,59,0.6) 75%);
          background-size: 200% auto;
          animation: shimmerSweep 1.4s linear infinite;
        }

        /* ── Card ── */
        .details-card {
          margin-top: 24px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(51,65,85,0.7);
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, var(--status-glow, rgba(52,211,153,0.08)) 0%, transparent 65%),
            rgba(2,8,20,0.8);
          backdrop-filter: blur(16px);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.45),
            0 0 0 1px rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeUp 0.35s ease 0.05s both;
          position: relative;
        }
        /* Status-color top shimmer line */
        .details-card::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: var(--status-bar, linear-gradient(90deg, #34d399, #10b981));
          opacity: 0.6;
          z-index: 2;
          pointer-events: none;
        }

        /* ── Image ── */
        .details-img-wrap {
          position: relative;
          aspect-ratio: 16/7;
          background: #070f1e;
          overflow: hidden;
        }
        .details-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .details-card:hover .details-img-wrap img {
          transform: scale(1.02);
        }
        /* Bottom gradient fade into card body */
        .details-img-wrap::after {
          content: '';
          position: absolute;
          inset: 35% 0 0 0;
          background: linear-gradient(to bottom, transparent, rgba(2,8,20,0.75));
          pointer-events: none;
        }
        .details-no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
          color: #334155;
        }

        /* ── Body ── */
        .details-body {
          padding: 24px 28px 28px;
          position: relative;
          z-index: 1;
        }

        /* Food name + status row */
        .details-name-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .details-food-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f1f5f9;
          line-height: 1.2;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        /* ── Info grid ── */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        @media (min-width: 640px) {
          .info-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .info-tile {
          border-radius: 12px;
          border: 1px solid rgba(51,65,85,0.5);
          background: rgba(15,23,42,0.6);
          padding: 12px 14px;
          transition: border-color 0.18s;
        }
        .info-tile:hover {
          border-color: rgba(51,65,85,0.8);
        }
        .info-tile-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 4px;
        }
        .info-tile-value {
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
          line-height: 1.3;
        }
        .info-tile-value.mono {
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          font-size: 11px;
          color: #64748b;
        }

        /* ── Divider ── */
        .details-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(51,65,85,0.5), transparent);
          margin-bottom: 20px;
        }

        /* ── Actions ── */
        .details-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .claim-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 10px;
          background: linear-gradient(135deg, #34d399, #10b981);
          border: none;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 700;
          color: #020814;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 16px rgba(52,211,153,0.3);
        }
        .claim-btn:hover {
          box-shadow: 0 0 24px rgba(52,211,153,0.5);
          transform: translateY(-1px);
        }
        .claim-btn:disabled {
          background: rgba(30,41,59,0.7);
          color: #334155;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 10px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .refresh-btn:hover {
          background: rgba(51,65,85,0.6);
          color: #f1f5f9;
        }
        .spin-icon { display: inline-block; animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="details-page">
        <div className="details-inner">

          {/* ── Header ── */}
          <div className="details-header">
            <div>
              <div className="details-title">🍽 Food Details</div>
              <div className="details-id">{listingId}</div>
            </div>
            <div className="back-btns">
              <Link to="/dashboard" className="back-btn">← Dashboard</Link>
              <Link to="/" className="back-btn">🗺 Map</Link>
            </div>
          </div>

          {/* ── Alert ── */}
          {error && <div className="alert">⚠ {error}</div>}

          {/* ── Skeleton ── */}
          {loading && !listing && (
            <div className="skeleton-wrap">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line" style={{ height: 22, width: '45%' }} />
                <div className="skeleton-line" style={{ height: 13, width: '30%' }} />
                <div className="skeleton-line" style={{ height: 13, width: '55%' }} />
                <div className="skeleton-line" style={{ height: 13, width: '40%' }} />
              </div>
            </div>
          )}

          {/* ── Detail card ── */}
          {listing && sc && (
            <div
              className="details-card"
              style={{
                // @ts-ignore
                '--status-glow': sc.glow,
                '--status-bar': `linear-gradient(90deg, ${sc.color}, ${sc.border})`,
              }}
            >
              {/* Image */}
              <div className="details-img-wrap">
                {resolveImageUrl(listing.imageUrl) ? (
                  <img
                    src={resolveImageUrl(listing.imageUrl) || undefined}
                    alt={listing.foodType}
                  />
                ) : (
                  <div className="details-no-image">
                    <span style={{ fontSize: 48, opacity: 0.2 }}>🍽️</span>
                    <span style={{ fontSize: 12, color: '#334155' }}>No image available</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="details-body">

                {/* Name + status */}
                <div className="details-name-row">
                  <div className="details-food-name">{listing.foodType}</div>
                  <span
                    className="status-badge"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                  >
                    {sc.emoji} {listing.status}
                  </span>
                </div>

                {/* Info tiles */}
                <div className="info-grid">
                  <div className="info-tile">
                    <div className="info-tile-label">🏨 Hotel</div>
                    <div className="info-tile-value">{listing.restaurantName || 'Restaurant'}</div>
                  </div>
                  <div className="info-tile">
                    <div className="info-tile-label">🍱 Quantity</div>
                    <div className="info-tile-value">{listing.quantity} meals</div>
                  </div>
                  <div className="info-tile">
                    <div className="info-tile-label">⏱ Expires in</div>
                    <div className="info-tile-value">{timeLeft}</div>
                  </div>
                  {typeof listing.distanceKm === 'number' && (
                    <div className="info-tile">
                      <div className="info-tile-label">📌 Distance</div>
                      <div className="info-tile-value">{listing.distanceKm.toFixed(2)} km</div>
                    </div>
                  )}
                  <div className="info-tile">
                    <div className="info-tile-label">📍 Location</div>
                    <div className="info-tile-value mono">
                      {listing.location.latitude.toFixed(4)},&nbsp;
                      {listing.location.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="details-divider" />

                {/* Actions */}
                <div className="details-actions">
                  <button
                    disabled={listing.status !== 'available'}
                    onClick={onClaim}
                    className="claim-btn"
                    type="button"
                  >
                    ✋ Claim food
                  </button>
                  <button
                    onClick={refresh}
                    className="refresh-btn"
                    type="button"
                  >
                    {loading
                      ? <><span className="spin-icon">⟳</span> Refreshing…</>
                      : <>⟳ Refresh</>
                    }
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}