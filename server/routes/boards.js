const express = require('express');
const { body } = require('express-validator');

const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const boardController = require('../controllers/boardController');
const { boardTaskRouter } = require('./tasks');

const router = express.Router();

// Every board route needs a logged in user.
router.use(protect);

const boardValidators = [
  body('title').trim().notEmpty().withMessage('Board title is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Description cannot be longer than 300 characters')
];

router
  .route('/')
  .get(boardController.getBoards)
  .post(boardValidators, validate, boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getBoard)
  .put(boardValidators, validate, boardController.updateBoard)
  .delete(boardController.deleteBoard);

// /api/boards/:boardId/tasks
router.use('/:boardId/tasks', boardTaskRouter);

module.exports = router;
