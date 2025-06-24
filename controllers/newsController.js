const News = require('../models/NewsArticle');

// CREATE News
const createNews = async (req, res) => {
  try {
    const { title, content, category, city, isBreaking } = req.body;

    const news = new News({
      title,
      content,
      category,
      city,
      isBreaking: isBreaking || false,
      author: req.user.id
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// READ All News
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// READ Single News
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE News
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    if (news.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE News
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    if (news.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await news.remove();
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// FILTER by Category
const getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// FILTER by City
const getNewsByCity = async (req, res) => {
  try {
    const news = await News.find({ city: req.params.city });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// FILTER Breaking News
const getBreakingNews = async (req, res) => {
  try {
    const news = await News.find({ isBreaking: true }).sort({ createdAt: -1 }).limit(10);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getNewsByCity,
  getBreakingNews
};
