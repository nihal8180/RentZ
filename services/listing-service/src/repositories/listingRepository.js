/**
 * listingRepository - the only file that talks to the Listing Mongoose
 * model directly. Listings stay on MongoDB even after auth/location move
 * to MySQL (flexible schema across ROOM/HOUSE/PG/FLAT types), but keeping
 * this abstraction anyway makes testing and future changes easier.
 */

const Listing = require('../models/Listing');

async function create(data) {
  const listing = new Listing(data);
  return listing.save();
}

async function findById(id) {
  return Listing.findById(id);
}

async function findByOwner(ownerId) {
  return Listing.find({ ownerId }).sort({ createdAt: -1 });
}

async function search(filters = {}, { page = 1, limit = 20 } = {}) {
  const query = { status: 'ACTIVE' };

  if (filters.city) query['location.city'] = new RegExp(`^${filters.city}$`, 'i');
  if (filters.locality) query['location.locality'] = new RegExp(filters.locality, 'i');
  if (filters.type) query.type = filters.type;
  if (filters.minRent || filters.maxRent) {
    query.rent = {};
    if (filters.minRent) query.rent.$gte = Number(filters.minRent);
    if (filters.maxRent) query.rent.$lte = Number(filters.maxRent);
  }
  if (filters.bhk) query.bhk = Number(filters.bhk);
  if (filters.bathrooms) query.bathrooms = { $gte: Number(filters.bathrooms) };
  if (filters.furnishing) query.furnishing = filters.furnishing;

  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Listing.countDocuments(query),
  ]);

  return { results, total, page: Number(page), limit: Number(limit) };
}

async function update(id, updates) {
  return Listing.findByIdAndUpdate(id, updates, { new: true });
}

async function remove(id) {
  return Listing.findByIdAndDelete(id);
}

module.exports = { create, findById, findByOwner, search, update, remove };
