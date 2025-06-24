const express = require('express');
const router = express.Router();
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getNewsByCity,
  getBreakingNews,
} = require('../controllers/newsController');

const { verifyEditorToken } = require('../middleware/authMiddleware');

// CREATE news (Editor only)
router.post('/create', verifyEditorToken, createNews);

// READ all news
router.get('/', getAllNews);

// READ by ID
router.get('/:id', getNewsById);

// READ news by category
router.get('/category/:category', getNewsByCategory);

// READ news by city
router.get('/city/:city', getNewsByCity);

// READ breaking news
router.get('/breaking', getBreakingNews);

// UPDATE news (Editor only, should check inside controller for ownership)
router.put('/:id', verifyEditorToken, updateNews);

// DELETE news (Editor only, should check inside controller for ownership)
router.delete('/:id', verifyEditorToken, deleteNews);

module.exports = router;
