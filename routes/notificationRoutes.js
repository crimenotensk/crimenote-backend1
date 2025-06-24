const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getEditorNotifications,
  markAsRead,
  getUnreadCount
} = require('../controllers/notificationController');

// Get editor's notifications
router.get('/', verifyToken, getEditorNotifications);

// Mark notifications as read
router.post('/mark-read', verifyToken, markAsRead);

// Get unread notification count
router.get('/unread-count', verifyToken, getUnreadCount);

module.exports = router; 