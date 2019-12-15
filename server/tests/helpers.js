const request = require('supertest');
const app = require('../app');

/**
 * Register a user and return the token plus the user document.
 */
async function createUser(overrides) {
  const payload = Object.assign(
    {
      name: 'Test User',
      email: 'test' + Date.now() + Math.random().toString(16).slice(2) + '@example.com',
      password: 'secret123'
    },
    overrides || {}
  );

  const res = await request(app).post('/api/auth/register').send(payload);

  return { token: res.body.token, user: res.body.user, password: payload.password };
}

/**
 * Create a board owned by the user behind the given token.
 */
async function createBoard(token, overrides) {
  const res = await request(app)
    .post('/api/boards')
    .set('Authorization', 'Bearer ' + token)
    .send(Object.assign({ title: 'Test board', description: 'A board' }, overrides || {}));

  return res.body;
}

module.exports = { createUser: createUser, createBoard: createBoard };
