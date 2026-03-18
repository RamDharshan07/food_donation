import type { LatLng, Listing, ListingsResponse } from './types'

export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000'

export async function apiGetListings(origin: LatLng, opts?: { radiusKm?: number }) {
  const url = new URL('/api/listings', API_BASE)
  url.searchParams.set('nearLat', String(origin.latitude))
  url.searchParams.set('nearLng', String(origin.longitude))
  url.searchParams.set('radiusKm', String(opts?.radiusKm ?? 50))
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load listings')
  return (await res.json()) as ListingsResponse
}

export async function apiGetListingById(listingId: string, origin?: LatLng) {
  const url = new URL(`/api/listings/${listingId}`, API_BASE)
  if (origin) {
    url.searchParams.set('nearLat', String(origin.latitude))
    url.searchParams.set('nearLng', String(origin.longitude))
  }
  const res = await fetch(url)
  const data = (await res.json().catch(() => ({}))) as {
    mode?: 'mock' | 'mongo'
    listing?: Listing
    error?: string
  }
  if (!res.ok) throw new Error(data?.error || 'Listing not found')
  if (!data.listing || !data.mode) throw new Error('Invalid server response')
  return { mode: data.mode, listing: data.listing }
}

export async function apiCreateListingJson(input: {
  restaurantName: string
  foodType: string
  quantity: number
  expiryMinutes: number
  location: LatLng
}) {
  const res = await fetch(`${API_BASE}/api/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantName: input.restaurantName,
      foodType: input.foodType,
      quantity: input.quantity,
      expiryMinutes: input.expiryMinutes,
      location: input.location,
    }),
  })
  if (!res.ok) throw new Error('Failed to create listing')
  return (await res.json()) as { mode: 'mock' | 'mongo'; listing: Listing }
}

export async function apiCreateListingWithImage(input: {
  restaurantName: string
  foodType: string
  quantity: number
  expiryMinutes: number
  latitude: number
  longitude: number
  imageFile?: File | null
}) {
  const form = new FormData()
  form.set('restaurantName', input.restaurantName)
  form.set('foodType', input.foodType)
  form.set('quantity', String(input.quantity))
  form.set('expiryMinutes', String(input.expiryMinutes))
  form.set('latitude', String(input.latitude))
  form.set('longitude', String(input.longitude))
  if (input.imageFile) form.set('image', input.imageFile)

  const res = await fetch(`${API_BASE}/api/listings`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to create listing')
  }
  return (await res.json()) as { mode: 'mock' | 'mongo'; listing: Listing }
}

export async function apiClaimListing(input: {
  listingId: string
  claimedBy: string
  claimedByName: string
}) {
  const res = await fetch(`${API_BASE}/api/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to claim listing')
  }
  return (await res.json()) as unknown
}

