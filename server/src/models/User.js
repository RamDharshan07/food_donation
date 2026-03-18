const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
)

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      required: true,
      enum: ['restaurant', 'ngo', 'volunteer'],
    },
    location: { type: LocationSchema, required: true },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)

