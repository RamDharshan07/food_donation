const mongoose = require('mongoose')

const ClaimSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
      unique: true, // Prevent multiple claims per listing
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    claimedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Claim', ClaimSchema)

