const rateLimit = require('express-rate-limit');

// Public search/browse traffic: higher volume expected, anonymous users
const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

// Owner/auth routes: lower volume, authenticated, protect against brute force
const ownerLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

// Login/signup specifically: tight limit to slow down credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, try again later' },
});

module.exports = { publicLimiter, ownerLimiter, authLimiter };
