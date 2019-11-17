const mongoose = require('mongoose');

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot be longer than 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be longer than 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: 'Status must be TODO, IN_PROGRESS or DONE'
      },
      default: 'TODO'
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: 'Priority must be LOW, MEDIUM or HIGH'
      },
      default: 'MEDIUM'
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

Task.STATUSES = STATUSES;
Task.PRIORITIES = PRIORITIES;

module.exports = Task;
