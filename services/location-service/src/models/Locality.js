const mongoose = require('mongoose');

/**
 * This model is intentionally simple/relational-shaped (city -> locality ->
 * pincode) on purpose: location-service, along with auth-service, is the
 * planned first candidate to migrate from MongoDB to MySQL, since master
 * data like this benefits from proper constraints and joins.
 */
const localitySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true, index: true },
    locality: { type: String, required: true, trim: true, index: true },
    pincode: { type: String, trim: true },
    state: { type: String, trim: true },
    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

localitySchema.index({ city: 1, locality: 1 }, { unique: true });

module.exports = mongoose.model('Locality', localitySchema);
