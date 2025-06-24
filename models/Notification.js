const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  editorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Editor',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

// Add indexes for better query performance
notificationSchema.index({ editorId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 