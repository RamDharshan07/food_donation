const express = require('express')
const mongoose = require('mongoose')

const Listing = require('../models/Listing')
const Claim = require('../models/Claim')
const { createListing, expireListings } = require('../mock/store')
const { distanceKm } = require('../utils/geo')
const { upload } = require('../middleware/upload')

const router = express.Router()

function parseNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function nowIso() {
  return new Date().toISOString()
}

function normalizeListingForClient(listing, claim) {
  const id = String(listing._id)
  return {
    _id: id,
    restaurantId: listing.restaurantId ? String(listing.restaurantId) : null,
    restaurantName: listing.restaurantName || undefined, // mock only
    foodType: listing.foodType,
    quantity: listing.quantity,
    expiryTime:
      listing.expiryTime instanceof Date ? listing.expiryTime.toISOString() : listing.expiryTime,
    location: listing.location,
    status: listing.status,
    claimedBy: claim?.claimedBy ? String(claim.claimedBy) : listing.claimedBy || null,
    imageUrl: listing.imageUrl || null,
    createdAt:
      listing.createdAt instanceof Date ? listing.createdAt.toISOString() : listing.createdAt || nowIso(),
  }
}

// GET /api/listings?nearLat=&nearLng=&radiusKm=
router.get('/', async (req, res) => {
  const nearLat = parseNumber(req.query.nearLat)
  const nearLng = parseNumber(req.query.nearLng)
  const radiusKm = parseNumber(req.query.radiusKm) ?? 10

  if (req.useMock) {
    const store = req.mock
    expireListings(store)
    let listings = store.listings.filter((l) => l.status !== 'expired')
    if (nearLat != null && nearLng != null) {
      const origin = { latitude: nearLat, longitude: nearLng }
      listings = listings
        .map((l) => ({
          l,
          d: distanceKm(origin, l.location),
        }))
        .filter((x) => x.d <= radiusKm)
        .sort((a, b) => a.d - b.d)
        .map((x) => ({ ...x.l, distanceKm: x.d }))
    }
    return res.json({ mode: 'mock', listings })
  }

  // Mongo mode
  const query = { status: { $in: ['available', 'claimed'] } }
  const listings = await Listing.find(query).sort({ createdAt: -1 }).lean()

  // Attach claim status (optional)
  const ids = listings.map((l) => l._id)
  const claims = await Claim.find({ listingId: { $in: ids } }).lean()
  const claimByListing = new Map(claims.map((c) => [String(c.listingId), c]))

  let out = listings.map((l) => {
    const c = claimByListing.get(String(l._id))
    const normalized = normalizeListingForClient(l, c)
    if (nearLat != null && nearLng != null) {
      normalized.distanceKm = distanceKm(
        { latitude: nearLat, longitude: nearLng },
        l.location
      )
    }
    return normalized
  })

  if (nearLat != null && nearLng != null) {
    out = out
      .filter((l) => (l.distanceKm ?? Infinity) <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  }

  res.json({ mode: 'mongo', listings: out })
})

// GET /api/listings/:id
// Optional query: nearLat=&nearLng= (to include distanceKm)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const nearLat = parseNumber(req.query.nearLat)
  const nearLng = parseNumber(req.query.nearLng)

  if (req.useMock) {
    const store = req.mock
    expireListings(store)
    const listing = store.listings.find((l) => String(l._id) === String(id))
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    const out = { ...listing }
    if (nearLat != null && nearLng != null) {
      out.distanceKm = distanceKm({ latitude: nearLat, longitude: nearLng }, listing.location)
    }
    return res.json({ mode: 'mock', listing: out })
  }

  const listing = await Listing.findById(id).lean()
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  const claim = await Claim.findOne({ listingId: listing._id }).lean()
  const out = normalizeListingForClient(listing, claim)
  if (nearLat != null && nearLng != null) {
    out.distanceKm = distanceKm({ latitude: nearLat, longitude: nearLng }, listing.location)
  }
  return res.json({ mode: 'mongo', listing: out })
})

// POST /api/listings
// Supports:
// - JSON: { restaurantId, restaurantName?, foodType, quantity, expiryMinutes?, expiryTime?, location{lat,lng}|{latitude,longitude} }
// - multipart/form-data: fields (restaurantId, restaurantName, foodType, quantity, expiryMinutes, expiryTime, latitude, longitude) + file "image"
router.post('/', upload.single('image'), async (req, res) => {
  const body = req.body || {}

  const restaurantId = body.restaurantId
  const restaurantName = body.restaurantName
  const foodType = body.foodType
  const quantity = body.quantity
  const expiryMinutes = body.expiryMinutes
  const expiryTime = body.expiryTime

  const location =
    body.location ||
    (body.latitude != null && body.longitude != null
      ? { latitude: Number(body.latitude), longitude: Number(body.longitude) }
      : undefined)

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

  if (!foodType || !quantity || !location) {
    return res.status(400).json({ error: 'foodType, quantity, and location are required' })
  }

  const loc = {
    latitude: location.latitude ?? location.lat,
    longitude: location.longitude ?? location.lng,
  }
  if (loc.latitude == null || loc.longitude == null) {
    return res.status(400).json({ error: 'location must include latitude/longitude' })
  }

  const exp =
    expiryTime ||
    (expiryMinutes ? new Date(Date.now() + Number(expiryMinutes) * 60 * 1000).toISOString() : null)
  if (!exp) {
    return res.status(400).json({ error: 'expiryMinutes or expiryTime is required' })
  }

  if (req.useMock) {
    const store = req.mock
    const created = createListing({
      restaurantId: restaurantId || 'rest_1',
      restaurantName: restaurantName || 'Restaurant (Demo)',
      foodType,
      quantity: Number(quantity),
      expiryTime: exp,
      location: loc,
      imageUrl,
    })
    store.listings.unshift(created)
    return res.status(201).json({ mode: 'mock', listing: created })
  }

  const createDoc = {
    foodType,
    quantity: Number(quantity),
    expiryTime: new Date(exp),
    location: loc,
    status: 'available',
    imageUrl,
  }

  if (restaurantId && mongoose.isValidObjectId(restaurantId)) {
    createDoc.restaurantId = restaurantId
  }

  const created = await Listing.create({
    ...createDoc,
  })

  res.status(201).json({ mode: 'mongo', listing: normalizeListingForClient(created.toObject()) })
})

module.exports = router

