const express = require('express');
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('listingId').notEmpty().withMessage('listingId is required'),
    body('ownerId').notEmpty().withMessage('ownerId is required'),
    body('message').trim().notEmpty().withMessage('message is required'),
  ],
  inquiryController.createInquiry
);

router.get('/owner', requireAuth, inquiryController.getOwnerInquiries);
router.get('/mine', requireAuth, inquiryController.getMyInquiries);
router.put('/:id/status', requireAuth, inquiryController.updateStatus);

module.exports = router;
