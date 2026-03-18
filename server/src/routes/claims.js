const express = require('express')
const mongoose = require('mongoose')

const Listing = require('../models/Listing')
const Claim = require('../models/Claim')
const { expireListings } = require('../mock/store')

const router = express.Router()

// POST /api/claims
// body: { listingId, claimedBy, claimedByName? }
router.post('/', async (req, res) => {
  const { listingId, claimedBy, claimedByName } = req.body || {}
  if (!listingId || !claimedBy) {
    return res.status(400).json({ error: 'listingId and claimedBy are required' })
  }

  if (req.useMock) {
    const store = req.mock
    expireListings(store)
    const listing = store.listings.find((l) => l._id === listingId)
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    if (listing.status !== 'available') {
      return res.status(409).json({ error: `Listing is ${listing.status}` })
    }
    listing.status = 'claimed'
    listing.claimedBy = claimedBy
    const claim = {
      _id: `clm_${Date.now()}`,
      listingId,
      claimedBy,
      claimedByName: claimedByName || 'NGO (Demo)',
      status: 'active',
      claimedAt: new Date().toISOString(),
      completedAt: null,
    }
    store.claims.push(claim)
    return res.status(201).json({ mode: 'mock', claim, listing })
  }

  if (!mongoose.isValidObjectId(listingId) || !mongoose.isValidObjectId(claimedBy)) {
    return res.status(400).json({ error: 'listingId and claimedBy must be valid ObjectIds' })
  }

  // Claim locking: only one active claim per listing (unique index on Claim.listingId)
  const listing = await Listing.findOne({ _id: listingId }).lean()
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  if (listing.status !== 'available') {
    return res.status(409).json({ error: `Listing is ${listing.status}` })
  }
  if (new Date(listing.expiryTime).getTime() <= Date.now()) {
    await Listing.updateOne({ _id: listingId }, { $set: { status: 'expired' } })
    return res.status(409).json({ error: 'Listing expired' })
  }

  try {
    const claim = await Claim.create({ listingId, claimedBy, status: 'active' })
    await Listing.updateOne({ _id: listingId }, { $set: { status: 'claimed' } })
    return res.status(201).json({ mode: 'mongo', claim })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Already claimed' })
    }
    throw err
  }
})

// POST /api/claims/:claimId/complete
router.post('/:claimId/complete', async (req, res) => {
  const { claimId } = req.params

  if (req.useMock) {
    const store = req.mock
    const claim = store.claims.find((c) => c._id === claimId)
    if (!claim) return res.status(404).json({ error: 'Claim not found' })
    if (claim.status !== 'active') {
      return res.status(409).json({ error: `Claim is ${claim.status}` })
    }
    claim.status = 'completed'
    claim.completedAt = new Date().toISOString()
    const listing = store.listings.find((l) => l._id === claim.listingId)
    if (listing) listing.status = 'completed'
    return res.json({ mode: 'mock', claim, listing })
  }

  if (!mongoose.isValidObjectId(claimId)) {
    return res.status(400).json({ error: 'claimId must be a valid ObjectId' })
  }

  const claim = await Claim.findById(claimId)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })
  if (claim.status !== 'active') {
    return res.status(409).json({ error: `Claim is ${claim.status}` })
  }

  claim.status = 'completed'
  claim.completedAt = new Date()
  await claim.save()
  await Listing.updateOne({ _id: claim.listingId }, { $set: { status: 'completed' } })

  res.json({ mode: 'mongo', claim })
})

module.exports = router

