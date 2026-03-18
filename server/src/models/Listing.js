const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
)

const ListingSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    foodType: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    expiryTime: { type: Date, required: true },
    location: { type: LocationSchema, required: true },
    status: {
      type: String,
      required: true,
      enum: ['available', 'claimed', 'expired', 'completed'],
      default: 'available',
    },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
)

ListingSchema.index({ status: 1, expiryTime: 1 })

module.exports = mongoose.model('Listing', ListingSchema)

