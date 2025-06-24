const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['editor', 'admin'],
    default: 'editor'
  },
  approved: {
    type: Boolean,
    default: false
  },
  city: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Editor', editorSchema);
