const jwt = require('jsonwebtoken');

/**
 * Issues a signed JWT for an authenticated user.
 * Payload kept minimal on purpose - other services (listing-service,
 * inquiry-service, etc.) only need userId and role to authorize requests.
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = generateToken;
