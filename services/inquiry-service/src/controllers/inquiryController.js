const { validationResult } = require('express-validator');
const inquiryRepository = require('../repositories/inquiryRepository');

// POST /api/inquiries  (USER only) - body includes listingId + ownerId (fetched
// from listing-service's GET /api/listings/:id response on the frontend)
async function createInquiry(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { listingId, ownerId, message, contactPhone } = req.body;

    const inquiry = await inquiryRepository.create({
      listingId,
      ownerId,
      userId: req.user.userId,
      message,
      contactPhone,
    });

    return res.status(201).json(inquiry);
  } catch (err) {
    console.error('[inquiry-service] createInquiry error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/inquiries/owner  (OWNER) - leads received on their listings
async function getOwnerInquiries(req, res) {
  try {
    const inquiries = await inquiryRepository.findByOwner(req.user.userId);
    return res.status(200).json(inquiries);
  } catch (err) {
    console.error('[inquiry-service] getOwnerInquiries error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/inquiries/mine  (USER) - inquiries they've sent
async function getMyInquiries(req, res) {
  try {
    const inquiries = await inquiryRepository.findByUser(req.user.userId);
    return res.status(200).json(inquiries);
  } catch (err) {
    console.error('[inquiry-service] getMyInquiries error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/inquiries/:id/status  (OWNER)
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await inquiryRepository.updateStatus(req.params.id, req.user.userId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error('[inquiry-service] updateStatus error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createInquiry, getOwnerInquiries, getMyInquiries, updateStatus };
