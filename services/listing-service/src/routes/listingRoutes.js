const express = require('express');
const { body } = require('express-validator');
const listingController = require('../controllers/listingController');
const { requireAuth, requireRole, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

const listingValidation = [
  body('type').isIn(['ROOM', 'HOUSE', 'PG', 'FLAT']).withMessage('Invalid property type'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('rent').isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.locality').trim().notEmpty().withMessage('Locality is required'),
];

// Public routes
router.get('/search', listingController.searchListings);
router.get('/:id', optionalAuth, listingController.getListing);

// Owner routes
router.post('/', requireAuth, requireRole('OWNER', 'ADMIN'), listingValidation, listingController.createListing);
router.get('/mine/all', requireAuth, requireRole('OWNER', 'ADMIN'), listingController.getMyListings);
router.put('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), listingController.updateListing);
router.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), listingController.deleteListing);

module.exports = router;
