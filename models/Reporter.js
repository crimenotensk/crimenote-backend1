const mongoose = require('mongoose');

const reporterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'नाव आवश्यक आहे'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'पद आवश्यक आहे'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'शहर आवश्यक आहे'],
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Add text index for search functionality
reporterSchema.index({ name: 1 }); // Index for sorting alphabetically

module.exports = mongoose.model('Reporter', reporterSchema); 