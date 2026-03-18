const mongoose = require('mongoose')

async function connectDb() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn('MONGO_URI not set; running in mock-data mode.')
    return false
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB || undefined,
  })
  console.log('Connected to MongoDB')
  return true
}

module.exports = { connectDb }

