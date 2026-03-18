const { verifyToken } = require('../utils/jwt')
const User = require('../models/User')

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing Bearer token' })
    }

    const decoded = verifyToken(token)
    const userId = decoded?.sub
    if (!userId) return res.status(401).json({ error: 'Invalid token' })

    if (req.useMock) {
      const store = req.mock
      const user = store.users.find((u) => u._id === userId)
      if (!user) return res.status(401).json({ error: 'User not found' })
      req.user = { _id: user._id, email: user.email || `${userId}@demo.local`, role: user.role, name: user.name }
      return next()
    }

    const user = await User.findById(userId).select('_id email role name').lean()
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    return next()
  } catch (_e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

module.exports = { requireAuth, requireRole }

