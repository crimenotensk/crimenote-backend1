const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getStats, getUsers, updateUser, getAnalyticsOverview, getPostsTrend } = require('../controllers/adminController');
const { getAllSubscribers, sendNewsletter } = require('../controllers/subscriberController');

// All routes require admin role
router.use(verifyToken, requireRole('admin'));

// Get admin dashboard statistics
router.get('/stats', getStats);

// User management routes
router.get('/users', getUsers);
router.put('/users/:userId', updateUser);

// Newsletter routes
router.get('/subscribers', getAllSubscribers);
router.post('/newsletter/send', sendNewsletter);

// Analytics endpoints
router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/posts-trend', getPostsTrend);

module.exports = router; 