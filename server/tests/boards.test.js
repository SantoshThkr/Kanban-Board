const request = require('supertest');
const app = require('../app');
const { createUser, createBoard } = require('./helpers');

describe('Board API', function () {
  it('requires a token', async function () {
    const res = await request(app).get('/api/boards');

    expect(res.status).toBe(401);
  });

  it('creates a board for the logged in user', async function () {
    const owner = await createUser();

    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ title: 'Portfolio site', description: 'Rebuild it' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Portfolio site');
    expect(res.body.owner).toBe(owner.user._id);
  });

  it('rejects a board without a title', async function () {
    const owner = await createUser();

    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ description: 'No title here' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/title is required/i);
  });

  it('only lists boards that belong to the user', async function () {
    const owner = await createUser();
    const other = await createUser();

    await createBoard(owner.token, { title: 'Mine' });
    await createBoard(other.token, { title: 'Theirs' });

    const res = await request(app)
      .get('/api/boards')
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Mine');
  });

  it('updates a board', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    const res = await request(app)
      .put('/api/boards/' + board._id)
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ title: 'Renamed board', description: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Renamed board');
  });

  it('deletes a board', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    const res = await request(app)
      .delete('/api/boards/' + board._id)
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(200);

    const after = await request(app)
      .get('/api/boards/' + board._id)
      .set('Authorization', 'Bearer ' + owner.token);

    expect(after.status).toBe(404);
  });

  it('blocks another user from reading or changing the board', async function () {
    const owner = await createUser();
    const other = await createUser();
    const board = await createBoard(owner.token);
    const auth = 'Bearer ' + other.token;

    const read = await request(app).get('/api/boards/' + board._id).set('Authorization', auth);
    const update = await request(app)
      .put('/api/boards/' + board._id)
      .set('Authorization', auth)
      .send({ title: 'Hijacked' });
    const remove = await request(app)
      .delete('/api/boards/' + board._id)
      .set('Authorization', auth);

    expect(read.status).toBe(403);
    expect(update.status).toBe(403);
    expect(remove.status).toBe(403);
  });

  it('returns 404 for a board that does not exist', async function () {
    const owner = await createUser();

    const res = await request(app)
      .get('/api/boards/000000000000000000000000')
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid board id', async function () {
    const owner = await createUser();

    const res = await request(app)
      .get('/api/boards/not-a-valid-id')
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(400);
  });
});
