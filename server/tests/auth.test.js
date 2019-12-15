const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('POST /api/auth/register', function () {
  it('creates a user and returns a token', async function () {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Santosh', email: 'santosh@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('santosh@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('hashes the password instead of storing it as plain text', async function () {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Santosh', email: 'hash@example.com', password: 'secret123' });

    const user = await User.findOne({ email: 'hash@example.com' }).select('+password');

    expect(user.password).not.toBe('secret123');
    expect(await user.matchPassword('secret123')).toBe(true);
  });

  it('rejects a short password', async function () {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Santosh', email: 'short@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  it('rejects an email that is already registered', async function () {
    const payload = { name: 'Santosh', email: 'dup@example.com', password: 'secret123' };

    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

describe('POST /api/auth/login', function () {
  beforeEach(async function () {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Santosh', email: 'login@example.com', password: 'secret123' });
  });

  it('returns a token for valid credentials', async function () {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('rejects a wrong password with 401', async function () {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('rejects an unknown email with 401', async function () {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', function () {
  it('returns the logged in user', async function () {
    const registered = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Santosh', email: 'me@example.com', password: 'secret123' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + registered.body.token);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });

  it('returns 401 without a token', async function () {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('returns 401 for a malformed token', async function () {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.real.token');

    expect(res.status).toBe(401);
  });
});
