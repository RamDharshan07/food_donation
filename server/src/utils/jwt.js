const jwt = require('jsonwebtoken')

function requireJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Add it to server/.env')
  }
  return secret
}

function signToken(payload) {
  const secret = requireJwtSecret()
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, secret, { expiresIn })
}

function verifyToken(token) {
  const secret = requireJwtSecret()
  return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }

