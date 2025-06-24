const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  commentText: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: true
  }
});

// Add indexes for better query performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userEmail: 1 });

module.exports = mongoose.model('Comment', commentSchema); 