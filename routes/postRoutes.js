const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const { verifyToken, verifyAdminToken } = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getCities,
  getCategories,
  getPostBySlug,
  incrementViews,
  getPopularPosts
} = require('../controllers/postController');

// POST - Create a new post
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      type,
      city,
      content,
      title,
      mediaUrl,
      isBreaking,
      summary,
      createdBy,
    } = req.body;

    // Basic validation
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    // Create and save new post
    const newPost = new Post({
      type,
      city,
      content,
      title: title || 'Untitled', // Fallback title if none provided
      mediaUrl,
      isBreaking: isBreaking || false,
      summary,
      createdBy, // This will be null if not provided
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post saved successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post', details: error.message });
  }
});

// GET - Fetch all posts
router.get('/', getPosts);
router.get('/cities', getCities);
router.get('/categories', getCategories);
router.get('/:id', getPost);
router.get('/popular', getPopularPosts);
router.get('/:slug', getPostBySlug);

// Protected routes
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyAdminToken, deletePost);
router.put('/:id/view', incrementViews);

module.exports = router; 