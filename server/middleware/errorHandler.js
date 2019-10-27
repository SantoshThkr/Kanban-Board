/**
 * 404 handler for unknown routes.
 */
function notFound(req, res, next) {
  res.status(404).json({ message: 'Route not found: ' + req.originalUrl });
}

/**
 * Central error handler. Turns known Mongoose errors into
 * useful status codes and keeps everything else a 500.
 */
/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  // Invalid ObjectId in the URL
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id: ' + err.value;
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)[0].message;
  }

  // Duplicate key (for example an email that is already registered)
  if (err.code === 11000) {
    status = 400;
    message = 'That ' + Object.keys(err.keyValue)[0] + ' is already in use';
  }

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message: message });
}

module.exports = { notFound: notFound, errorHandler: errorHandler };
