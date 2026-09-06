const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String, // references User._id from auth-service (cross-service, no hard FK)
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['ROOM', 'HOUSE', 'PG', 'FLAT'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    bhk: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    furnishing: {
      type: String,
      enum: ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'],
      default: 'UNFURNISHED',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // URLs returned by media-service
      default: [],
    },
    location: {
      city: { type: String, required: true, index: true },
      locality: { type: String, required: true, index: true },
      pincode: { type: String },
      addressLine: { type: String },
      geo: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'ACTIVE', 'RENTED', 'INACTIVE'],
      default: 'PENDING_APPROVAL',
    },
  },
  { timestamps: true }
);

// Compound index to speed up the common "search by city + locality + status" query
listingSchema.index({ 'location.city': 1, 'location.locality': 1, status: 1 });

module.exports = mongoose.model('Listing', listingSchema);
