const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleMarathi: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentMarathi: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['crime', 'investigation', 'court', 'police', 'other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Editor',
    required: true
  },
  author: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isBreaking: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search functionality
newsArticleSchema.index({ 
  title: 'text', 
  titleMarathi: 'text', 
  content: 'text', 
  contentMarathi: 'text',
  tags: 'text' 
});

// Add index for better query performance on breaking news
newsArticleSchema.index({ isBreaking: 1, createdAt: -1 });

module.exports = mongoose.model('NewsArticle', newsArticleSchema); 