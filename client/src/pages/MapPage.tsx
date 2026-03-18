import { useEffect, useMemo, useState } from 'react'
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
    case 'available':
      return 'marker-dot marker-dot--available'
    case 'claimed':
      return 'marker-dot marker-dot--claimed'
    case 'completed':
      return 'marker-dot marker-dot--completed'
    case 'expired':
    default:
      return 'marker-dot marker-dot--expired'
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

  async function refresh() {
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
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    refresh()
    const t = window.setInterval(refresh, 10_000)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // if origin changes (my location becomes available), refresh once
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin.latitude, origin.longitude])

  // if radius changes, refresh once
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusKm])

  // local 1s tick so expiry countdown updates without refetch
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-100">
            Map
          </div>
          <div className="text-sm text-slate-300">
            Origin: <span className="font-medium">{originLabel}</span> · Mode:{' '}
            <span className="font-medium">{mode ?? '...'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-1 flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 ring-1 ring-slate-800">
            <button
              type="button"
              onClick={() => {
                setOriginMode('my')
                requestMyLocation()
              }}
              className={[
                'rounded-md px-2.5 py-1.5 text-xs font-semibold',
                originMode === 'my' ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
              ].join(' ')}
              title={locError || (locStatus === 'loading' ? 'Getting location…' : 'Use current location')}
            >
              My
            </button>
            <button
              type="button"
              onClick={() => setOriginMode('ngo')}
              className={[
                'rounded-md px-2.5 py-1.5 text-xs font-semibold',
                originMode === 'ngo' ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
              ].join(' ')}
              title="Use NGO origin"
            >
              NGO
            </button>
          </div>
          <div className="mr-1 flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 ring-1 ring-slate-800">
            {[10, 12, 20, 30, 40].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r as 10 | 12 | 20 | 30 | 40)}
                className={[
                  'rounded-md px-2.5 py-1.5 text-xs font-semibold',
                  radiusKm === r ? 'bg-emerald-300 text-slate-950' : 'text-slate-200 hover:bg-slate-800',
                ].join(' ')}
                title={`Show listings within ${r} km`}
              >
                {r}km
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
            type="button"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {originMode === 'my' && locStatus === 'error' ? (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Couldn’t access your location, using NGO origin instead. {locError}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <MapContainer center={mapCenter} zoom={14} style={{ height: 560, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[origin.latitude, origin.longitude]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{originLabel}</div>
                <div className="text-slate-600">
                  ({origin.latitude.toFixed(4)}, {origin.longitude.toFixed(4)})
                </div>
              </div>
            </Popup>
          </Marker>

          {listings.map((l) => (
            <Marker
              key={l._id}
              position={[l.location.latitude, l.location.longitude]}
              icon={markerIcon(l.status)}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup()
                },
                click: (e) => {
                  e.target.openPopup()
                },
              }}
            >
              <Popup autoClose={false} closeOnClick={false}>
                <div className="text-sm">
                  <div className="font-semibold">{l.restaurantName || 'Hotel'}</div>
                  <div>
                    <span className="font-medium">{l.foodType}</span> · {l.quantity} meals
                  </div>
                  <div>Status: {l.status}</div>
                  <div>Expires in: {formatTimeLeft(l.expiryTime)}</div>
                  {typeof l.distanceKm === 'number' ? (
                    <div>Distance: {l.distanceKm.toFixed(2)} km</div>
                  ) : null}
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      to={`/food/${l._id}`}
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800"
                    >
                      View details
                    </Link>
                    <button
                      disabled={l.status !== 'available'}
                      onClick={() => onClaim(l._id)}
                      className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
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

      <div className="mt-3 text-xs text-slate-400">
        Hover a <span className="font-semibold text-emerald-300">green</span> marker to see the
        hotel name + details button. Click <span className="font-semibold">View details</span> to
        open the details page.
      </div>
    </div>
  )
}

