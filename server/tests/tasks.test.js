const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');
const { createUser, createBoard } = require('./helpers');

async function createTask(token, boardId, overrides) {
  const res = await request(app)
    .post('/api/boards/' + boardId + '/tasks')
    .set('Authorization', 'Bearer ' + token)
    .send(Object.assign({ title: 'Write the README' }, overrides || {}));

  return res.body;
}

describe('Task API', function () {
  it('creates a task with sensible defaults', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    const res = await request(app)
      .post('/api/boards/' + board._id + '/tasks')
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ title: 'Write the README' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('TODO');
    expect(res.body.priority).toBe('MEDIUM');
    expect(res.body.board).toBe(board._id);
  });

  it('rejects a task without a title', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    const res = await request(app)
      .post('/api/boards/' + board._id + '/tasks')
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ description: 'Missing the title' });

    expect(res.status).toBe(400);
  });

  it('rejects an unknown priority', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    const res = await request(app)
      .post('/api/boards/' + board._id + '/tasks')
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ title: 'Ship it', priority: 'URGENT' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/priority/i);
  });

  it('lists the tasks of a board', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    await createTask(owner.token, board._id, { title: 'First' });
    await createTask(owner.token, board._id, { title: 'Second' });

    const res = await request(app)
      .get('/api/boards/' + board._id + '/tasks')
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('moves a task to another column', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);
    const task = await createTask(owner.token, board._id);

    const res = await request(app)
      .put('/api/tasks/' + task._id)
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
    expect(res.body.title).toBe(task.title);
  });

  it('changes the priority of a task', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);
    const task = await createTask(owner.token, board._id);

    const res = await request(app)
      .put('/api/tasks/' + task._id)
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ priority: 'HIGH' });

    expect(res.status).toBe(200);
    expect(res.body.priority).toBe('HIGH');
  });

  it('rejects an unknown status', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);
    const task = await createTask(owner.token, board._id);

    const res = await request(app)
      .put('/api/tasks/' + task._id)
      .set('Authorization', 'Bearer ' + owner.token)
      .send({ status: 'ARCHIVED' });

    expect(res.status).toBe(400);
  });

  it('deletes a task', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);
    const task = await createTask(owner.token, board._id);

    const res = await request(app)
      .delete('/api/tasks/' + task._id)
      .set('Authorization', 'Bearer ' + owner.token);

    expect(res.status).toBe(200);
    expect(await Task.countDocuments({})).toBe(0);
  });

  it('stops another user from adding or changing tasks', async function () {
    const owner = await createUser();
    const other = await createUser();
    const board = await createBoard(owner.token);
    const task = await createTask(owner.token, board._id);

    const created = await request(app)
      .post('/api/boards/' + board._id + '/tasks')
      .set('Authorization', 'Bearer ' + other.token)
      .send({ title: 'Not allowed' });

    const updated = await request(app)
      .put('/api/tasks/' + task._id)
      .set('Authorization', 'Bearer ' + other.token)
      .send({ status: 'DONE' });

    expect(created.status).toBe(403);
    expect(updated.status).toBe(403);
  });

  it('removes the tasks of a board when the board is deleted', async function () {
    const owner = await createUser();
    const board = await createBoard(owner.token);

    await createTask(owner.token, board._id, { title: 'One' });
    await createTask(owner.token, board._id, { title: 'Two' });

    await request(app)
      .delete('/api/boards/' + board._id)
      .set('Authorization', 'Bearer ' + owner.token);

    expect(await Task.countDocuments({ board: board._id })).toBe(0);
  });
});
