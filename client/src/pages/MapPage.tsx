// import { useEffect, useMemo, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
// import L from 'leaflet'

// import { apiClaimListing, apiGetListings } from '../lib/api'
// import { useAuth } from '../auth/AuthContext'
// import { useOrigin } from '../lib/origin'
// import { useRadius } from '../lib/radius'
// import { formatTimeLeft } from '../lib/time'
// import type { Listing, ListingStatus } from '../lib/types'

// function statusDotClass(status: ListingStatus) {
//   switch (status) {
//     case 'available':
//       return 'marker-dot marker-dot--available'
//     case 'claimed':
//       return 'marker-dot marker-dot--claimed'
//     case 'completed':
//       return 'marker-dot marker-dot--completed'
//     case 'expired':
//     default:
//       return 'marker-dot marker-dot--expired'
//   }
// }

// function markerIcon(status: ListingStatus) {
//   return L.divIcon({
//     className: '',
//     html: `<div class="${statusDotClass(status)}"></div>`,
//     iconSize: [14, 14],
//     iconAnchor: [7, 7],
//   })
// }

// export function MapPage() {
//   const { mode: originMode, setMode: setOriginMode, origin, originLabel, locError, locStatus, requestMyLocation } =
//     useOrigin()
//   const { radiusKm, setRadiusKm } = useRadius(10)
//   const { user } = useAuth()
//   const [mode, setMode] = useState<'mock' | 'mongo' | null>(null)
//   const [listings, setListings] = useState<Listing[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const mapCenter = useMemo<[number, number]>(
//     () => [origin.latitude, origin.longitude],
//     [origin.latitude, origin.longitude]
//   )

//   async function refresh() {
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await apiGetListings(origin, { radiusKm })
//       setMode(data.mode)
//       setListings(data.listings)
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Failed to load')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     delete (L.Icon.Default.prototype as any)._getIconUrl
//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
//       iconUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
//       shadowUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
//     })

//     refresh()
//     const t = window.setInterval(refresh, 10_000)
//     return () => window.clearInterval(t)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // if origin changes (my location becomes available), refresh once
//   useEffect(() => {
//     refresh()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [origin.latitude, origin.longitude])

//   // if radius changes, refresh once
//   useEffect(() => {
//     refresh()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [radiusKm])

//   // local 1s tick so expiry countdown updates without refetch
//   const [, setNowTick] = useState(0)
//   useEffect(() => {
//     const t = window.setInterval(() => setNowTick((x) => x + 1), 1000)
//     return () => window.clearInterval(t)
//   }, [])

//   async function onClaim(listingId: string) {
//     if (!user || user.role !== 'ngo') {
//       setError('Please login as an NGO account to claim food.')
//       return
//     }
//     setError(null)
//     try {
//       await apiClaimListing({
//         listingId,
//         claimedBy: user._id,
//         claimedByName: user.name,
//       })
//       await refresh()
//     } catch (e2) {
//       setError(e2 instanceof Error ? e2.message : 'Failed to claim')
//     }
//   }

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6">
//       <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
//         <div>
//           <div className="text-2xl font-semibold tracking-tight text-slate-100">
//             Map
//           </div>
//           <div className="text-sm text-slate-300">
//             Origin: <span className="font-medium">{originLabel}</span> · Mode:{' '}
//             <span className="font-medium">{mode ?? '...'}</span>
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

//       <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
//         <MapContainer center={mapCenter} zoom={14} style={{ height: 560, width: '100%' }}>
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           <Marker position={[origin.latitude, origin.longitude]}>
//             <Popup>
//               <div className="text-sm">
//                 <div className="font-semibold">{originLabel}</div>
//                 <div className="text-slate-600">
//                   ({origin.latitude.toFixed(4)}, {origin.longitude.toFixed(4)})
//                 </div>
//               </div>
//             </Popup>
//           </Marker>

//           {listings.map((l) => (
//             <Marker
//               key={l._id}
//               position={[l.location.latitude, l.location.longitude]}
//               icon={markerIcon(l.status)}
//               eventHandlers={{
//                 mouseover: (e) => {
//                   e.target.openPopup()
//                 },
//                 click: (e) => {
//                   e.target.openPopup()
//                 },
//               }}
//             >
//               <Popup autoClose={false} closeOnClick={false}>
//                 <div className="text-sm">
//                   <div className="font-semibold">{l.restaurantName || 'Hotel'}</div>
//                   <div>
//                     <span className="font-medium">{l.foodType}</span> · {l.quantity} meals
//                   </div>
//                   <div>Status: {l.status}</div>
//                   <div>Expires in: {formatTimeLeft(l.expiryTime)}</div>
//                   {typeof l.distanceKm === 'number' ? (
//                     <div>Distance: {l.distanceKm.toFixed(2)} km</div>
//                   ) : null}
//                   <div className="mt-2 flex items-center gap-2">
//                     <Link
//                       to={`/food/${l._id}`}
//                       className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800"
//                     >
//                       View details
//                     </Link>
//                     <button
//                       disabled={l.status !== 'available'}
//                       onClick={() => onClaim(l._id)}
//                       className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
//                       type="button"
//                     >
//                       Claim
//                     </button>
//                   </div>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       <div className="mt-3 text-xs text-slate-400">
//         Hover a <span className="font-semibold text-emerald-300">green</span> marker to see the
//         hotel name + details button. Click <span className="font-semibold">View details</span> to
//         open the details page.
//       </div>
//     </div>
//   )
// }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

import { apiClaimListing, apiGetListings } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { useOrigin } from '../lib/origin'
import { useRadius } from '../lib/radius'
import { formatTimeLeft } from '../lib/time'
import type { Listing, ListingStatus } from '../lib/types'

function statusDotClass(status: ListingStatus) {
  switch (status) {
    case 'available':  return 'marker-dot marker-dot--available'
    case 'claimed':    return 'marker-dot marker-dot--claimed'
    case 'completed':  return 'marker-dot marker-dot--completed'
    case 'expired':
    default:           return 'marker-dot marker-dot--expired'
  }
}

function markerIcon(status: ListingStatus) {
  return L.divIcon({
    className: '',
    html: `<div class="${statusDotClass(status)}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export function MapPage() {
  const { mode: originMode, setMode: setOriginMode, origin, originLabel, locError, locStatus, requestMyLocation } =
    useOrigin()
  const { radiusKm, setRadiusKm } = useRadius(10)
  const { user } = useAuth()
  const [mode, setMode] = useState<'mock' | 'mongo' | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapCenter = useMemo<[number, number]>(
    () => [origin.latitude, origin.longitude],
    [origin.latitude, origin.longitude]
  )

  // useCallback so refresh always closes over the LATEST origin + radiusKm
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetListings(origin, { radiusKm })
      setMode(data.mode)
      setListings(data.listings)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [origin, radiusKm]) // re-created whenever origin or radius changes

  // Keep a ref that always points to the latest refresh —
  // the interval reads from the ref so it never uses a stale closure
  const refreshRef = useRef(refresh)
  useEffect(() => { refreshRef.current = refresh }, [refresh])

  // One-time setup: leaflet icon fix + start the auto-refresh interval
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
    refreshRef.current()
    // Interval always calls the latest refresh via ref — never stale
    const t = window.setInterval(() => refreshRef.current(), 10_000)
    return () => window.clearInterval(t)
  }, []) // runs once only

  // Re-fetch when origin changes (my location becomes available)
  useEffect(() => {
    refresh()
  }, [origin.latitude, origin.longitude]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when radius changes
  useEffect(() => {
    refresh()
  }, [radiusKm]) // eslint-disable-line react-hooks/exhaustive-deps

  const [, setNowTick] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setNowTick((x) => x + 1), 1000)
    return () => window.clearInterval(t)
  }, [])

  async function onClaim(listingId: string) {
    if (!user || user.role !== 'ngo') {
      setError('Please login as an NGO account to claim food.')
      return
    }
    setError(null)
    try {
      await apiClaimListing({
        listingId,
        claimedBy: user._id,
        claimedByName: user.name,
      })
      await refresh()
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Failed to claim')
    }
  }

  // ── Client-side radius guard ──────────────────────────────────────────────
  // Haversine distance (km) between two lat/lng points
  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  // Only render markers that are within the selected radius
  const visibleListings = useMemo(
    () =>
      listings.filter((l) => {
        // Prefer the server-supplied distanceKm if present
        const dist =
          typeof l.distanceKm === 'number'
            ? l.distanceKm
            : haversineKm(
                origin.latitude,
                origin.longitude,
                l.location.latitude,
                l.location.longitude
              )
        return dist <= radiusKm
      }),
    [listings, origin.latitude, origin.longitude, radiusKm]
  )
  // ──────────────────────────────────────────────────────────────────────────

  const available  = visibleListings.filter(l => l.status === 'available').length
  const claimed    = visibleListings.filter(l => l.status === 'claimed').length
  const completed  = visibleListings.filter(l => l.status === 'completed').length
  const expired    = visibleListings.filter(l => l.status === 'expired').length

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
        @keyframes pulse-live {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        .map-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(52,211,153,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 90% 80%, rgba(16,185,129,0.03) 0%, transparent 60%),
            #020814;
          animation: fadeUp 0.3s ease both;
        }
        .map-inner {
          max-width: 1152px;
          margin: 0 auto;
          padding: 28px 16px 48px;
        }

        /* ── Header ── */
        .map-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .map-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }
        .map-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .map-subtitle {
          margin-top: 5px;
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .map-subtitle strong { color: #94a3b8; font-weight: 600; }
        .live-dot {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #34d399;
        }
        .live-dot::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px rgba(52,211,153,0.7);
          animation: pulse-live 1.4s ease-in-out infinite;
        }
        .mode-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid rgba(51,65,85,0.6);
          background: rgba(15,23,42,0.7);
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.04em;
        }

        /* ── Controls ── */
        .map-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
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
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #64748b;
          transition: all 0.18s ease;
        }
        .seg-btn:hover:not(.seg-active-light):not(.seg-active-emerald) {
          background: rgba(51,65,85,0.5);
          color: #cbd5e1;
        }
        .seg-active-light {
          background: #f1f5f9;
          color: #020814;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .seg-active-emerald {
          background: linear-gradient(135deg, #34d399, #10b981);
          color: #020814;
          box-shadow: 0 0 10px rgba(52,211,153,0.35), 0 1px 4px rgba(0,0,0,0.3);
        }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 5px;
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
        .spin-icon { display: inline-block; animation: spin 0.8s linear infinite; }

        /* ── Alerts ── */
        .alert {
          margin-top: 14px;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 12px;
          line-height: 1.5;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.25s ease both;
        }
        .alert-error { border: 1px solid rgba(248,113,113,0.25); background: rgba(239,68,68,0.08); color: #fca5a5; }
        .alert-warn  { border: 1px solid rgba(251,191,36,0.25);  background: rgba(245,158,11,0.08); color: #fde68a; }

        /* ── Stats bar ── */
        .stats-bar {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .stat-chip {
          display: flex; align-items: center; gap: 5px;
          border-radius: 999px;
          border: 1px solid rgba(51,65,85,0.5);
          background: rgba(15,23,42,0.6);
          padding: 3px 10px;
          font-size: 11px;
          color: #64748b;
          backdrop-filter: blur(6px);
        }
        .stat-chip strong { color: #94a3b8; font-weight: 700; }
        .stat-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── Map container ── */
        .map-wrap {
          margin-top: 20px;
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(51,65,85,0.7);
          box-shadow:
            0 0 0 1px rgba(52,211,153,0.06),
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeUp 0.4s ease 0.1s both;
        }
        /* Emerald shimmer top line */
        .map-wrap::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #34d399 40%, #6ee7b7 60%, transparent);
          opacity: 0.5;
          z-index: 1000;
          pointer-events: none;
        }
        /* Corner radius fix for leaflet */
        .map-wrap .leaflet-container {
          border-radius: 0;
          background: #0a1628;
        }

        /* ── Popup overrides ── */
        .leaflet-popup-content-wrapper {
          background: rgba(2,8,20,0.96) !important;
          border: 1px solid rgba(51,65,85,0.7) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(16px) !important;
          color: #f1f5f9 !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button {
          color: #64748b !important;
          font-size: 16px !important;
          top: 6px !important; right: 8px !important;
        }
        .leaflet-popup-close-button:hover { color: #f1f5f9 !important; }

        .popup-inner {
          padding: 14px 16px;
          min-width: 200px;
        }
        .popup-name {
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 6px;
        }
        .popup-row {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .popup-row strong { color: #cbd5e1; font-weight: 600; }
        .popup-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 700;
        }
        .popup-divider {
          margin: 10px 0;
          height: 1px;
          background: rgba(51,65,85,0.5);
        }
        .popup-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .popup-btn-view {
          flex: 1;
          text-align: center;
          border-radius: 8px;
          background: rgba(30,41,59,0.9);
          border: 1px solid rgba(51,65,85,0.6);
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.18s;
        }
        .popup-btn-view:hover {
          background: rgba(51,65,85,0.8);
          color: #f1f5f9;
        }
        .popup-btn-claim {
          flex: 1;
          border-radius: 8px;
          background: linear-gradient(135deg, #34d399, #10b981);
          border: none;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #020814;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 0 10px rgba(52,211,153,0.25);
        }
        .popup-btn-claim:hover { box-shadow: 0 0 16px rgba(52,211,153,0.45); }
        .popup-btn-claim:disabled {
          background: rgba(30,41,59,0.7);
          color: #475569;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ── Legend ── */
        .map-legend {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 11px;
          color: #64748b;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .legend-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }

        /* ── Marker dots (global) ── */
        .marker-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(2,8,20,0.6);
          box-shadow: 0 0 6px rgba(0,0,0,0.4);
        }
        .marker-dot--available { background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.7); }
        .marker-dot--claimed   { background: #fbbf24; box-shadow: 0 0 8px rgba(251,191,36,0.6); }
        .marker-dot--completed { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,0.6); }
        .marker-dot--expired   { background: #f87171; box-shadow: 0 0 8px rgba(248,113,113,0.5); }

        .map-divider {
          margin-top: 20px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(51,65,85,0.5), transparent);
        }
      `}</style>

      <div className="map-page">
        <div className="map-inner">

          {/* ── Header ── */}
          <div className="map-header">
            <div>
              <div className="map-title">🗺 Map</div>
              <div className="map-subtitle">
                {/* <span>Origin: <strong>{originLabel}</strong></span>
                <span className="mode-badge">⚙ {mode ?? '…'}</span>
                <span className="live-dot">Live</span> */}
              </div>
            </div>

            <div className="map-controls">
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
              {/* <button onClick={refresh} className="refresh-btn" type="button">
                {loading
                  ? <><span className="spin-icon">⟳</span> Refreshing…</>
                  : <>⟳ Refresh</>
                }
              </button> */}
            </div>
          </div>

          {/* ── Alerts ── */}
          {error && (
            <div className="alert alert-error">⚠ {error}</div>
          )}
          {originMode === 'my' && locStatus === 'error' && (
            <div className="alert alert-warn">
              ⚠ Couldn't access your location — using NGO origin instead. {locError}
            </div>
          )}

          {/* ── Stats bar ── */}
          {visibleListings.length > 0 && (
            <div className="stats-bar">
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#34d399' }} />
                <strong>{available}</strong> available
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#fbbf24' }} />
                <strong>{claimed}</strong> claimed
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#60a5fa' }} />
                <strong>{completed}</strong> completed
              </div>
              <div className="stat-chip">
                <span className="stat-dot" style={{ background: '#f87171' }} />
                <strong>{expired}</strong> expired
              </div>
              <div className="stat-chip" style={{ marginLeft: 'auto' }}>
                🗺 Within <strong>{radiusKm} km</strong>
              </div>
            </div>
          )}

          {/* ── Map ── */}
          <div className="map-wrap">
            <MapContainer center={mapCenter} zoom={14} style={{ height: 560, width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Origin marker */}
              <Marker position={[origin.latitude, origin.longitude]}>
                <Popup>
                  <div className="popup-inner">
                    <div className="popup-name">📍 {originLabel}</div>
                    <div className="popup-row">
                      {origin.latitude.toFixed(4)}, {origin.longitude.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Listing markers — only within selected radius */}
              {visibleListings.map((l) => (
                <Marker
                  key={l._id}
                  position={[l.location.latitude, l.location.longitude]}
                  icon={markerIcon(l.status)}
                  eventHandlers={{
                    mouseover: (e) => { e.target.openPopup() },
                    click:     (e) => { e.target.openPopup() },
                  }}
                >
                  <Popup autoClose={false} closeOnClick={false}>
                    <div className="popup-inner">
                      <div className="popup-name">{l.restaurantName || 'Hotel'}</div>

                      <div className="popup-row">
                        🍽 <strong>{l.foodType}</strong> · {l.quantity} meals
                      </div>
                      <div className="popup-row">
                        ⏱ Expires in <strong>{formatTimeLeft(l.expiryTime)}</strong>
                      </div>
                      {typeof l.distanceKm === 'number' && (
                        <div className="popup-row">
                          📌 <strong>{l.distanceKm.toFixed(2)} km</strong> away
                        </div>
                      )}

                      <div className="popup-divider" />

                      <div style={{ marginBottom: 8 }}>
                        <span
                          className="popup-status"
                          style={{
                            background:
                              l.status === 'available'  ? 'rgba(52,211,153,0.15)' :
                              l.status === 'claimed'    ? 'rgba(251,191,36,0.15)' :
                              l.status === 'completed'  ? 'rgba(96,165,250,0.15)' :
                                                          'rgba(248,113,113,0.12)',
                            color:
                              l.status === 'available'  ? '#6ee7b7' :
                              l.status === 'claimed'    ? '#fcd34d' :
                              l.status === 'completed'  ? '#93c5fd' :
                                                          '#fca5a5',
                            border: `1px solid ${
                              l.status === 'available'  ? 'rgba(52,211,153,0.3)'  :
                              l.status === 'claimed'    ? 'rgba(251,191,36,0.3)'  :
                              l.status === 'completed'  ? 'rgba(96,165,250,0.3)'  :
                                                          'rgba(248,113,113,0.25)'
                            }`,
                          }}
                        >
                          {l.status === 'available'  ? '🟢' :
                           l.status === 'claimed'    ? '🟡' :
                           l.status === 'completed'  ? '🔵' : '🔴'} {l.status}
                        </span>
                      </div>

                      <div className="popup-actions">
                        <Link to={`/food/${l._id}`} className="popup-btn-view">
                          View details
                        </Link>
                        <button
                          disabled={l.status !== 'available'}
                          onClick={() => onClaim(l._id)}
                          className="popup-btn-claim"
                          type="button"
                        >
                          Claim
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* ── Legend ── */}
          <div className="map-legend">
            <span style={{ color: '#475569', fontSize: 11 }}>Hover or click a marker to view details</span>
            <span style={{ width: 1, height: 12, background: 'rgba(51,65,85,0.5)', display: 'inline-block' }} />
            {[
              { label: 'Available',  color: '#34d399' },
              { label: 'Claimed',    color: '#fbbf24' },
              { label: 'Completed',  color: '#60a5fa' },
              { label: 'Expired',    color: '#f87171' },
            ].map(({ label, color }) => (
              <span key={label} className="legend-item">
                <span className="legend-dot" style={{ background: color, boxShadow: `0 0 5px ${color}80` }} />
                {label}
              </span>
            ))}
          </div>

          <div className="map-divider" />
        </div>
      </div>
    </>
  )
}
