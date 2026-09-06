const { validationResult } = require('express-validator');
const listingRepository = require('../repositories/listingRepository');

// POST /api/listings  (OWNER only)
async function createListing(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const listing = await listingRepository.create({
      ...req.body,
      ownerId: req.user.userId,
      // Set straight to ACTIVE for now (testing phase, no moderation queue
      // yet) so listings are searchable immediately. Switch this back to
      // 'PENDING_APPROVAL' once an admin approval flow exists.
      status: 'ACTIVE',
    });

    return res.status(201).json(listing);
  } catch (err) {
    console.error('[listing-service] createListing error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/listings/:id  (public)
async function getListing(req, res) {
  try {
    const listing = await listingRepository.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    return res.status(200).json(listing);
  } catch (err) {
    console.error('[listing-service] getListing error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/listings/mine  (OWNER)
async function getMyListings(req, res) {
  try {
    const listings = await listingRepository.findByOwner(req.user.userId);
    return res.status(200).json(listings);
  } catch (err) {
    console.error('[listing-service] getMyListings error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/listings/search  (public) - main search endpoint for the public site
async function searchListings(req, res) {
  try {
    const { city, locality, type, minRent, maxRent, bhk, bathrooms, furnishing, page, limit } =
      req.query;

    const data = await listingRepository.search(
      { city, locality, type, minRent, maxRent, bhk, bathrooms, furnishing },
      { page, limit }
    );

    return res.status(200).json(data);
  } catch (err) {
    console.error('[listing-service] searchListings error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/listings/:id  (OWNER, must own the listing, or ADMIN)
async function updateListing(req, res) {
  try {
    const listing = await listingRepository.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await listingRepository.update(req.params.id, req.body);

    return res.status(200).json(updated);
  } catch (err) {
    console.error('[listing-service] updateListing error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/listings/:id  (OWNER, must own the listing, or ADMIN)
async function deleteListing(req, res) {
  try {
    const listing = await listingRepository.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await listingRepository.remove(req.params.id);

    return res.status(200).json({ message: 'Listing deleted' });
  } catch (err) {
    console.error('[listing-service] deleteListing error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createListing,
  getListing,
  getMyListings,
  searchListings,
  updateListing,
  deleteListing,
};
