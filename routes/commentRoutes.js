const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const {
  addComment,
  getCommentsByPost,
  getAllComments,
  deleteComment
} = require('../controllers/commentController');

// Public routes
router.post('/', addComment);
router.get('/post/:postId', getCommentsByPost);

// Admin only routes
router.get('/all', verifyAdminToken, getAllComments);
router.delete('/:id', verifyAdminToken, deleteComment);

module.exports = router; 