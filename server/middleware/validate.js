const { validationResult } = require('express-validator');

/**
 * Collect express-validator errors and return 400 with a readable message.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map(function (err) {
        return { field: err.path, message: err.msg };
      })
    });
  }

  next();
}

module.exports = validate;
