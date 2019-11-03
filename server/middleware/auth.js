const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Route guard. Reads the "Authorization: Bearer <token>" header,
 * verifies the JWT and attaches the user to the request.
 */
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
    }

    next(err);
  }
}

module.exports = protect;
