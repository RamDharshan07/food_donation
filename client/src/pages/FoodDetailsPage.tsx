import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { apiClaimListing, apiGetListingById } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { resolveImageUrl } from '../lib/images'
import { formatTimeLeft } from '../lib/time'
import type { Listing } from '../lib/types'

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-100">Food details</div>
          <div className="text-sm text-slate-300">
            <span className="font-mono">{listingId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Back to dashboard
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Back to map
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading && !listing ? (
        <div className="mt-6 text-sm text-slate-400">Loading…</div>
      ) : null}

      {listing ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
          <div className="aspect-[16/7] bg-slate-900">
            {resolveImageUrl(listing.imageUrl) ? (
              <img
                src={resolveImageUrl(listing.imageUrl) || undefined}
                alt={listing.foodType}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No image
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-1">
              <div className="text-xl font-semibold text-slate-100">{listing.foodType}</div>
              <div className="text-sm text-slate-300">
                Hotel: <span className="font-semibold">{listing.restaurantName || 'Restaurant'}</span>
              </div>
              <div className="text-sm text-slate-300">
                Quantity: <span className="font-semibold">{listing.quantity}</span> meals
              </div>
              <div className="text-sm text-slate-300">
                Status: <span className="font-semibold">{listing.status}</span>
              </div>
              <div className="text-sm text-slate-300">
                Expires in: <span className="font-semibold">{timeLeft}</span>
              </div>
              {typeof listing.distanceKm === 'number' ? (
                <div className="text-sm text-slate-300">
                  Distance: <span className="font-semibold">{listing.distanceKm.toFixed(2)} km</span>
                </div>
              ) : null}
              <div className="text-sm text-slate-400">
                Location: ({listing.location.latitude.toFixed(4)}, {listing.location.longitude.toFixed(4)})
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                disabled={listing.status !== 'available'}
                onClick={onClaim}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
              >
                Claim
              </button>
              <button
                onClick={refresh}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

