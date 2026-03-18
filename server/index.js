require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const { connectDb } = require('./src/config/db')
const { attachMockData } = require('./src/middleware/mockData')
const { startExpiryJob } = require('./src/jobs/expiryJob')

const listingsRouter = require('./src/routes/listings')
const claimsRouter = require('./src/routes/claims')
const authRouter = require('./src/routes/auth')

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// If Mongo isn't configured, serve demo mock data instead.
app.use(attachMockData)

app.use('/api/listings', listingsRouter)
app.use('/api/claims', claimsRouter)
app.use('/api/auth', authRouter)

const port = Number(process.env.PORT || 5000)

async function start() {
  await connectDb()
  startExpiryJob()
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})

