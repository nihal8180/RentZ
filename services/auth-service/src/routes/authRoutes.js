const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone')
      .trim()
      .isLength({ min: 10, max: 15 })
      .withMessage('Valid phone number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['OWNER', 'USER'])
      .withMessage('Role must be OWNER or USER'),
  ],
  authController.signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

router.get('/me', requireAuth, authController.getProfile);

module.exports = router;
