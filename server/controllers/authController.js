const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 * Create a new user and return a signed token.
 */
exports.register = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({ name: name, email: email, password: password });

    res.status(201).json({
      token: generateToken(user._id),
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Check the credentials and return a signed token.
 */
exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // password is select:false on the model, so ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};
