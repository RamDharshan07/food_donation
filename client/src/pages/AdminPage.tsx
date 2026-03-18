import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

import { apiCreateListingWithImage } from '../lib/api'
import { demoNgo } from '../lib/demo'

function LocationPicker({
  onChange,
}: {
  onChange: (next: { latitude: number; longitude: number }) => void
}) {
  const map = useMapEvents({
    click(e) {
      onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng })
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  return null
}

export function AdminPage() {
  const navigate = useNavigate()

  const [restaurantName, setRestaurantName] = useState('Restaurant (Demo)')
  const [foodType, setFoodType] = useState('Veg Meals')
  const [quantity, setQuantity] = useState(20)
  const [expiryMinutes, setExpiryMinutes] = useState(60)
  const [latitude, setLatitude] = useState(demoNgo.location.latitude)
  const [longitude, setLongitude] = useState(demoNgo.location.longitude)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locStatus, setLocStatus] = useState<string | null>(null)

  const markerRef = useRef<L.Marker | null>(null)

  const mapCenter = useMemo<LatLngExpression>(
    () => [latitude, longitude],
    [latitude, longitude]
  )

  const previewUrl = useMemo(() => {
    if (!imageFile) return null
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const created = await apiCreateListingWithImage({
        restaurantName,
        foodType,
        quantity,
        expiryMinutes,
        latitude,
        longitude,
        imageFile,
      })
      navigate(`/food/${created.listing._id}`)
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Failed to post food')
    } finally {
      setSubmitting(false)
    }
  }

  async function useMyLocation() {
    setLocStatus('Requesting location…')
    setError(null)
    if (!('geolocation' in navigator)) {
      setLocStatus(null)
      setError('Geolocation is not supported in this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)
        setLocStatus('Location updated')
        window.setTimeout(() => setLocStatus(null), 2000)
      },
      (err) => {
        setLocStatus(null)
        setError(err.message || 'Failed to get location')
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 }
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight text-slate-100">Admin</div>
        <div className="text-sm text-slate-300">
          Post a new food listing with details + image. Pick location on the map (no need to type
          latitude/longitude).
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <div>
          <label className="text-xs text-slate-300">Hotel / Restaurant name</label>
          <input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Food name / type</label>
          <input
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-300">Quantity (meals)</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">Expiry (minutes)</label>
            <input
              type="number"
              min={1}
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              required
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-100">Restaurant location</div>
              <div className="text-xs text-slate-400">
                Click on the map to place the pin, or drag the pin. Optionally use GPS.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={useMyLocation}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
              >
                Use my current location
              </button>
              {locStatus ? <div className="text-xs text-slate-300">{locStatus}</div> : null}
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-lg border border-slate-800">
            <MapContainer center={mapCenter} zoom={15} style={{ height: 260, width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker
                onChange={(next) => {
                  setLatitude(next.latitude)
                  setLongitude(next.longitude)
                }}
              />
              <Marker
                draggable
                position={[latitude, longitude]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(r: any) => {
                  markerRef.current = r as L.Marker
                }}
                eventHandlers={{
                  dragend: () => {
                    const m = markerRef.current
                    if (!m) return
                    const ll = m.getLatLng()
                    setLatitude(ll.lat)
                    setLongitude(ll.lng)
                  },
                }}
              />
            </MapContainer>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300">Latitude (auto)</label>
              <input
                value={latitude.toFixed(6)}
                readOnly
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300">Longitude (auto)</label>
              <input
                value={longitude.toFixed(6)}
                readOnly
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300">Food image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
          />
          {previewUrl ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-800">
              <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover" />
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {submitting ? 'Posting…' : 'Post food'}
        </button>
      </form>
    </div>
  )
}

