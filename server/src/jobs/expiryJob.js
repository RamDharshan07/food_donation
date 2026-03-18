const Listing = require('../models/Listing')

function startExpiryJob() {
  if (!process.env.MONGO_URI) return null
  const intervalMs = Number(process.env.EXPIRY_SWEEP_MS || 30_000)
  return setInterval(async () => {
    try {
      await Listing.updateMany(
        { status: 'available', expiryTime: { $lte: new Date() } },
        { $set: { status: 'expired' } }
      )
    } catch (e) {
      console.warn('Expiry job failed', e?.message || e)
    }
  }, intervalMs)
}

module.exports = { startExpiryJob }

