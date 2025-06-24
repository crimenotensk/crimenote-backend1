const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Editor',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['breaking', 'featured', 'regular'],
    default: 'regular'
  },
  images: [{
    url: String,
    caption: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
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

// Pre-save middleware to generate slug
postSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('title')) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true
    });
    
    // Check if slug exists
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingPost = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
      if (!existingPost) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Update updatedAt timestamp
  this.updatedAt = new Date();
  
  next();
});

module.exports = mongoose.model('Post', postSchema); 