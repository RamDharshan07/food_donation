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

export function ListingCard({ listing }: { listing: Listing }) {
  const imgSrc = resolveImageUrl(listing.imageUrl)
  return (
    <Link
      to={`/food/${listing._id}`}
      className="group block overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700"
    >
      <div className="aspect-[16/9] w-full bg-slate-900">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={listing.foodType}
            className="h-full w-full object-cover opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">{listing.foodType}</div>
            <div className="mt-0.5 text-xs text-slate-400">
              {listing.restaurantName || 'Restaurant'} · {listing.quantity} meals
            </div>
          </div>
          <div className={statusPill(listing.status)}>{listing.status}</div>
        </div>
        <div className="mt-3 text-xs text-slate-300">
          Expires in <span className="font-semibold">{formatTimeLeft(listing.expiryTime)}</span>
          {typeof listing.distanceKm === 'number' ? (
            <>
              {' '}
              · <span className="font-semibold">{listing.distanceKm.toFixed(2)} km</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

