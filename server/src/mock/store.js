const { randomUUID } = require('crypto')

// Coimbatore-ish coordinates (demo)
const demoRestaurants = [
  {
    _id: 'rest_1',
    name: 'Restaurant A',
    role: 'restaurant',
    location: { latitude: 11.0168, longitude: 76.9558 },
    phone: '9000000001',
  },
  {
    _id: 'rest_2',
    name: 'Restaurant B',
    role: 'restaurant',
    location: { latitude: 11.0125, longitude: 76.962 },
    phone: '9000000002',
  },
]

const demoNgos = [
  {
    _id: 'ngo_1',
    name: 'NGO A',
    role: 'ngo',
    location: { latitude: 11.02, longitude: 76.96 },
    phone: '9000001001',
  },
  {
    _id: 'ngo_2',
    name: 'NGO B',
    role: 'ngo',
    location: { latitude: 11.009, longitude: 76.953 },
    phone: '9000001002',
  },
]

const now = Date.now()

function minutesFromNow(mins) {
  return new Date(now + mins * 60 * 1000).toISOString()
}

function createListing({
  restaurantId,
  restaurantName,
  foodType,
  quantity,
  expiryTime,
  location,
  imageUrl,
}) {
  return {
    _id: `lst_${randomUUID()}`,
    restaurantId,
    restaurantName,
    foodType,
    quantity,
    expiryTime,
    location,
    status: 'available',
    claimedBy: null,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  }
}

// In-memory singleton store (survives across requests within a server run)
let singleton = null

function getMockStore() {
  if (singleton) return singleton

  const listings = [
    createListing({
      restaurantId: demoRestaurants[0]._id,
      restaurantName: demoRestaurants[0].name,
      foodType: 'Veg Meals',
      quantity: 25,
      expiryTime: minutesFromNow(90),
      location: demoRestaurants[0].location,
      imageUrl: null,
    }),
    createListing({
      restaurantId: demoRestaurants[1]._id,
      restaurantName: demoRestaurants[1].name,
      foodType: 'Bread + Curry',
      quantity: 15,
      expiryTime: minutesFromNow(45),
      location: demoRestaurants[1].location,
      imageUrl: null,
    }),
  ]

  const claims = []

  singleton = {
    users: [...demoRestaurants, ...demoNgos],
    listings,
    claims,
  }
  return singleton
}

function expireListings(store) {
  const nowMs = Date.now()
  for (const l of store.listings) {
    if (l.status === 'available' && new Date(l.expiryTime).getTime() <= nowMs) {
      l.status = 'expired'
    }
  }
}

module.exports = { getMockStore, createListing, expireListings }

