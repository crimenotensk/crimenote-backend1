const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/subscriberController');

// Public route for newsletter subscription
router.post('/subscribe', subscribe);

module.exports = router; 