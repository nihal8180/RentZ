const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true, index: true },
    ownerId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    message: { type: String, required: true, trim: true },
    contactPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'CLOSED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
