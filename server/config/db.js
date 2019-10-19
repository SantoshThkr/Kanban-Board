const mongoose = require('mongoose');

/**
 * Connect to MongoDB. The connection string is read from the
 * MONGO_URI environment variable so the same code works locally
 * and in production.
 */
async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined. Check your .env file.');
  }

  const conn = await mongoose.connect(mongoUri);
  console.log('MongoDB connected: ' + conn.connection.host);

  return conn;
}

module.exports = connectDB;
