const express = require('express')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const User = require('../models/User')
const { signToken } = require('../utils/jwt')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

function sanitizeUser(u) {
  return { _id: String(u._id), name: u.name, email: u.email, role: u.role }
}

// POST /api/auth/register
// body: { name, email, password, role, location:{latitude,longitude} }
router.post('/register', async (req, res) => {
  const { name, email, password, role, location } = req.body || {}

  if (!name || !email || !password || !role || !location) {
    return res.status(400).json({ error: 'name, email, password, role, location are required' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  if (!normalizedEmail.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  if (!['restaurant', 'ngo', 'volunteer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  const loc = {
    latitude: Number(location.latitude ?? location.lat),
    longitude: Number(location.longitude ?? location.lng),
  }
  if (!Number.isFinite(loc.latitude) || !Number.isFinite(loc.longitude)) {
    return res.status(400).json({ error: 'Invalid location' })
  }

  if (req.useMock) {
    const store = req.mock
    const exists = store.users.some((u) => (u.email || '').toLowerCase() === normalizedEmail)
    if (exists) return res.status(409).json({ error: 'Email already registered' })
    const _id = `usr_${Date.now()}`
    const user = { _id, name, email: normalizedEmail, role, location: loc, phone: '' }
    store.users.push(user)
    let token
    try {
      token = signToken({ sub: _id, role })
    } catch (e) {
      return res.status(500).json({
        error: e instanceof Error ? e.message : 'JWT_SECRET not configured',
      })
    }
    return res.status(201).json({ token, user: sanitizeUser(user) })
  }

  const existing = await User.findOne({ email: normalizedEmail }).lean()
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hash = await bcrypt.hash(String(password), 10)
  const created = await User.create({
    name,
    email: normalizedEmail,
    password: hash,
    role,
    location: loc,
  })

  let token
  try {
    token = signToken({ sub: String(created._id), role: created.role })
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'JWT_SECRET not configured',
    })
  }
  res.status(201).json({ token, user: sanitizeUser(created.toObject()) })
})

// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

  const normalizedEmail = String(email).trim().toLowerCase()

  if (req.useMock) {
    const store = req.mock
    const user = store.users.find((u) => (u.email || '').toLowerCase() === normalizedEmail)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    // mock mode: accept any password for demo
    let token
    try {
      token = signToken({ sub: user._id, role: user.role })
    } catch (e) {
      return res.status(500).json({
        error: e instanceof Error ? e.message : 'JWT_SECRET not configured',
      })
    }
    return res.json({ token, user: sanitizeUser(user) })
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password').lean()
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(String(password), user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  let token
  try {
    token = signToken({ sub: String(user._id), role: user.role })
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'JWT_SECRET not configured',
    })
  }
  res.json({ token, user: sanitizeUser(user) })
})

// GET /api/auth/me (requires Bearer token)
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

module.exports = router

