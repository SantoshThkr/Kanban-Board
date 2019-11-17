const Task = require('../models/Task');
const { findOwnedBoard } = require('./boardController');

/**
 * Find a task and make sure it belongs to the logged in user.
 */
async function findOwnedTask(taskId, userId, res) {
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return null;
  }

  if (task.owner.toString() !== userId.toString()) {
    res.status(403).json({ message: 'You do not have access to this task' });
    return null;
  }

  return task;
}

/**
 * GET /api/boards/:boardId/tasks - every task on a board.
 */
exports.getTasks = async function (req, res, next) {
  try {
    const board = await findOwnedBoard(req.params.boardId, req.user._id, res);
    if (!board) return;

    const tasks = await Task.find({ board: board._id }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/boards/:boardId/tasks - add a task to a board.
 */
exports.createTask = async function (req, res, next) {
  try {
    const board = await findOwnedBoard(req.params.boardId, req.user._id, res);
    if (!board) return;

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'TODO',
      priority: req.body.priority || 'MEDIUM',
      board: board._id,
      owner: req.user._id
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id - edit a task or move it to another column.
 */
exports.updateTask = async function (req, res, next) {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id, res);
    if (!task) return;

    const fields = ['title', 'description', 'status', 'priority'];

    fields.forEach(function (field) {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id - remove a task.
 */
exports.deleteTask = async function (req, res, next) {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id, res);
    if (!task) return;

    await task.deleteOne();
    res.json({ message: 'Task removed', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
