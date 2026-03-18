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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-100">
            Dashboard
          </div>
          <div className="text-sm text-slate-300">
            Origin: <span className="font-semibold">{originLabel}</span> · Food listings shown as
            components/cards. Click any card to open details.
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l._id} listing={l} />
        ))}
      </div>

      {listings.length === 0 && !loading ? (
        <div className="mt-6 text-sm text-slate-400">No listings found.</div>
      ) : null}
    </div>
  )
}

