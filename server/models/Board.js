const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      maxlength: [80, 'Title cannot be longer than 80 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot be longer than 300 characters'],
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
