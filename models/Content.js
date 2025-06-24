const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['News', 'Article']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: function() {
      return this.type === 'News';
    }
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  summary: {
    type: String,
    required: function() {
      return this.type === 'News' && this.isBreaking;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
contentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', contentSchema); 