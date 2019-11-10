const Board = require('../models/Board');

/**
 * Find a board and make sure it belongs to the logged in user.
 * Returns null and sends the response when it is not usable.
 */
async function findOwnedBoard(boardId, userId, res) {
  const board = await Board.findById(boardId);

  if (!board) {
    res.status(404).json({ message: 'Board not found' });
    return null;
  }

  if (board.owner.toString() !== userId.toString()) {
    res.status(403).json({ message: 'You do not have access to this board' });
    return null;
  }

  return board;
}

/**
 * GET /api/boards - all boards owned by the logged in user.
 */
exports.getBoards = async function (req, res, next) {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/boards - create a board.
 */
exports.createBoard = async function (req, res, next) {
  try {
    const board = await Board.create({
      title: req.body.title,
      description: req.body.description || '',
      owner: req.user._id
    });

    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/boards/:id - a single board.
 */
exports.getBoard = async function (req, res, next) {
  try {
    const board = await findOwnedBoard(req.params.id, req.user._id, res);
    if (!board) return;

    res.json(board);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/boards/:id - rename or re-describe a board.
 */
exports.updateBoard = async function (req, res, next) {
  try {
    const board = await findOwnedBoard(req.params.id, req.user._id, res);
    if (!board) return;

    if (req.body.title !== undefined) {
      board.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      board.description = req.body.description;
    }

    const updated = await board.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/boards/:id - remove a board.
 */
exports.deleteBoard = async function (req, res, next) {
  try {
    const board = await findOwnedBoard(req.params.id, req.user._id, res);
    if (!board) return;

    await board.deleteOne();
    res.json({ message: 'Board removed', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.findOwnedBoard = findOwnedBoard;
