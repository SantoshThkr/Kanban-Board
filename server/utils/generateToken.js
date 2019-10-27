const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for the given user id.
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

module.exports = generateToken;
