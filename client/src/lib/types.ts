export type LatLng = { latitude: number; longitude: number }

export type ListingStatus = 'available' | 'claimed' | 'expired' | 'completed'

export type Listing = {
  _id: string
  restaurantId?: string | null
  restaurantName?: string
  foodType: string
  quantity: number
  expiryTime: string
  location: LatLng
  status: ListingStatus
  claimedBy?: string | null
  distanceKm?: number
  imageUrl?: string | null
}

export type ListingsResponse = { mode: 'mock' | 'mongo'; listings: Listing[] }

