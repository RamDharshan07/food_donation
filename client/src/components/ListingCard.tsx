// import { Link } from 'react-router-dom'
// import type { Listing } from '../lib/types'
// import { formatTimeLeft } from '../lib/time'
// import { resolveImageUrl } from '../lib/images'

// function statusPill(status: Listing['status']) {
//   const base = 'rounded-full px-2 py-0.5 text-[11px] font-semibold'
//   switch (status) {
//     case 'available':
//       return `${base} bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30`
//     case 'claimed':
//       return `${base} bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30`
//     case 'completed':
//       return `${base} bg-blue-500/15 text-blue-200 ring-1 ring-blue-500/30`
//     case 'expired':
//     default:
//       return `${base} bg-red-500/15 text-red-200 ring-1 ring-red-500/30`
//   }
// }

// export function ListingCard({ listing }: { listing: Listing }) {
//   const imgSrc = resolveImageUrl(listing.imageUrl)
//   return (
//     <Link
//       to={`/food/${listing._id}`}
//       className="group block overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700"
//     >
//       <div className="aspect-[16/9] w-full bg-slate-900">
//         {imgSrc ? (
//           <img
//             src={imgSrc}
//             alt={listing.foodType}
//             className="h-full w-full object-cover opacity-95 group-hover:opacity-100"
//             loading="lazy"
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center text-xs text-slate-400">
//             No image
//           </div>
//         )}
//       </div>
//       <div className="p-4">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className="text-sm font-semibold text-slate-100">{listing.foodType}</div>
//             <div className="mt-0.5 text-xs text-slate-400">
//               {listing.restaurantName || 'Restaurant'} · {listing.quantity} meals
//             </div>
//           </div>
//           <div className={statusPill(listing.status)}>{listing.status}</div>
//         </div>
//         <div className="mt-3 text-xs text-slate-300">
//           Expires in <span className="font-semibold">{formatTimeLeft(listing.expiryTime)}</span>
//           {typeof listing.distanceKm === 'number' ? (
//             <>
//               {' '}
//               · <span className="font-semibold">{listing.distanceKm.toFixed(2)} km</span>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </Link>
//   )
// }

import { Link } from 'react-router-dom'
import type { Listing } from '../lib/types'
import { formatTimeLeft } from '../lib/time'
import { resolveImageUrl } from '../lib/images'

function statusPill(status: Listing['status']) {
  const base = 'rounded-full px-2 py-0.5 text-[11px] font-semibold'
  switch (status) {
    case 'available':
      return `${base} bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30`
    case 'claimed':
      return `${base} bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30`
    case 'completed':
      return `${base} bg-blue-500/15 text-blue-200 ring-1 ring-blue-500/30`
    case 'expired':
    default:
      return `${base} bg-red-500/15 text-red-200 ring-1 ring-red-500/30`
  }
}

const statusGlow: Record<Listing['status'], string> = {
  available: 'rgba(52,211,153,0.12)',
  claimed:   'rgba(251,191,36,0.12)',
  completed: 'rgba(96,165,250,0.12)',
  expired:   'rgba(248,113,113,0.10)',
}

const statusBarColor: Record<Listing['status'], string> = {
  available: 'linear-gradient(90deg, #34d399, #10b981)',
  claimed:   'linear-gradient(90deg, #fbbf24, #f59e0b)',
  completed: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
  expired:   'linear-gradient(90deg, #f87171, #ef4444)',
}

// Styles injected once at module level — NOT inside the component,
// so they are never duplicated per-card which was hiding .card-restaurant text.
const CARD_STYLES = `
  @keyframes cardShine {
    0%   { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(220%) skewX(-12deg); }
  }
  .listing-card {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid rgba(51,65,85,0.7);
    background: rgba(2,8,20,0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
  }
  .listing-card:hover {
    transform: translateY(-4px);
    border-color: rgba(52,211,153,0.28);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.1), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .listing-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1.5px;
    background: var(--card-bar, linear-gradient(90deg,#34d399,#10b981));
    opacity: 0.5;
    z-index: 2;
    transition: opacity 0.25s;
  }
  .listing-card:hover::before { opacity: 1; }
  .listing-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transform: translateX(-100%) skewX(-12deg);
    z-index: 3;
    pointer-events: none;
  }
  .listing-card:hover::after { animation: cardShine 0.55s ease forwards; }

  .card-img-wrap {
    position: relative;
    aspect-ratio: 16/9;
    width: 100%;
    background: #0a1628;
    overflow: hidden;
  }
  .card-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.88;
    transition: opacity 0.3s ease, transform 0.4s ease;
    display: block;
  }
  .listing-card:hover .card-img-wrap img { opacity: 1; transform: scale(1.04); }
  .card-img-wrap::after {
    content: '';
    position: absolute;
    inset: 40% 0 0 0;
    background: linear-gradient(to bottom, transparent, rgba(2,8,20,0.65));
    pointer-events: none;
  }
  .card-no-image {
    display: flex; align-items: center; justify-content: center;
    height: 100%; font-size: 11px; color: #475569;
    letter-spacing: 0.05em; flex-direction: column; gap: 6px;
  }
  .card-body {
    padding: 14px 16px 16px;
    position: relative;
    z-index: 1;
  }
  .card-top-row {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
  }
  .card-food-type {
    font-size: 14px; font-weight: 700;
    color: #f1f5f9; letter-spacing: 0.01em; line-height: 1.3;
  }
  .card-meta {
    margin-top: 4px; font-size: 11px;
    display: flex; align-items: center; gap: 4px;
  }
  /* ── Explicit restaurant name style — was getting overridden by duplicate <style> tags ── */
  .card-restaurant {
    color: #94a3b8 !important;
    font-weight: 500;
  }
  .card-qty {
    color: #64748b;
  }
  .card-dot {
    width: 2px; height: 2px;
    border-radius: 50%;
    background: #475569;
    display: inline-block;
    flex-shrink: 0;
  }
  .card-footer {
    margin-top: 12px; padding-top: 10px;
    border-top: 1px solid rgba(51,65,85,0.4);
    display: flex; align-items: center;
    justify-content: space-between; font-size: 11px; color: #64748b;
  }
  .card-footer-left { display: flex; align-items: center; gap: 6px; }
  .card-expiry-highlight { font-weight: 700; color: #94a3b8; }
  .card-dist {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; color: #64748b;
    background: rgba(15,23,42,0.6);
    border: 1px solid rgba(51,65,85,0.5);
    border-radius: 999px; padding: 2px 8px;
  }
  .card-dist-val { font-weight: 700; color: #94a3b8; }
`

// Inject once into <head> — idempotent guard prevents duplicates
if (typeof document !== 'undefined' && !document.getElementById('listing-card-styles')) {
  const el = document.createElement('style')
  el.id = 'listing-card-styles'
  el.textContent = CARD_STYLES
  document.head.appendChild(el)
}

export function ListingCard({ listing }: { listing: Listing }) {
  const imgSrc = resolveImageUrl(listing.imageUrl)
  const glow = statusGlow[listing.status] ?? statusGlow.expired
  const bar  = statusBarColor[listing.status] ?? statusBarColor.expired

  return (
    <Link
      to={`/food/${listing._id}`}
      className="listing-card"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glow} 0%, transparent 70%), rgba(2,8,20,0.75)`,
        // @ts-ignore
        '--card-bar': bar,
      }}
    >
      {/* Image */}
      <div className="card-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={listing.foodType} loading="lazy" />
        ) : (
          <div className="card-no-image">
            <span style={{ fontSize: 28, opacity: 0.3 }}>🍽️</span>
            <span>No image</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-top-row">
          <div>
            <div className="card-food-type">{listing.foodType}</div>
            <div className="card-meta">
              {/* Restaurant name — explicit class so it's always visible */}
              <span className="card-restaurant">{listing.restaurantName || 'Restaurant'}</span>
              <span className="card-dot" />
              <span className="card-qty">{listing.quantity} meals</span>
            </div>
          </div>
          <div className={statusPill(listing.status)}>{listing.status}</div>
        </div>

        <div className="card-footer">
          <div className="card-footer-left">
            <span>
              ⏱ Expires in{' '}
              <span className="card-expiry-highlight">{formatTimeLeft(listing.expiryTime)}</span>
            </span>
          </div>
          {typeof listing.distanceKm === 'number' && (
            <div className="card-dist">
              📍 <span className="card-dist-val">{listing.distanceKm.toFixed(2)} km</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}