const express = require('express');
const { body } = require('express-validator');

const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const taskController = require('../controllers/taskController');
const Task = require('../models/Task');

// Nested under /api/boards/:boardId/tasks
const boardTaskRouter = express.Router({ mergeParams: true });

// Mounted at /api/tasks
const taskRouter = express.Router();

const taskValidators = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be longer than 500 characters'),
  body('status')
    .optional()
    .isIn(Task.STATUSES)
    .withMessage('Status must be TODO, IN_PROGRESS or DONE'),
  body('priority')
    .optional()
    .isIn(Task.PRIORITIES)
    .withMessage('Priority must be LOW, MEDIUM or HIGH')
];

// Updates may be partial, for example only a new status.
const taskUpdateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Task title is required')
].concat(taskValidators.slice(1));

boardTaskRouter
  .route('/')
  .get(protect, taskController.getTasks)
  .post(protect, taskValidators, validate, taskController.createTask);

taskRouter
  .route('/:id')
  .put(protect, taskUpdateValidators, validate, taskController.updateTask)
  .delete(protect, taskController.deleteTask);

module.exports = { boardTaskRouter: boardTaskRouter, taskRouter: taskRouter };
