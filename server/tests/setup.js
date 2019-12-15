const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// The API signs tokens with this secret during the tests.
process.env.JWT_SECRET = 'test_secret_used_only_by_jest';
process.env.JWT_EXPIRES_IN = '1h';

let mongod;

beforeAll(async function () {
  // Point MONGO_URI_TEST at a running MongoDB to skip the in-memory server.
  if (process.env.MONGO_URI_TEST) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    return;
  }

  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

// Start every test from an empty database.
afterEach(async function () {
  const collections = mongoose.connection.collections;

  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
});

afterAll(async function () {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();

  if (mongod) {
    await mongod.stop();
  }
});
