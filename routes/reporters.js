const express = require('express');
const router = express.Router();
const reporterController = require('../controllers/reporterController');
const { verifyEditorToken } = require('../middleware/authMiddleware');

// Public route
router.get('/', reporterController.getAllReporters);

// Protected routes (Admin only)
router.post('/', verifyEditorToken, reporterController.createReporter);
router.put('/:id', verifyEditorToken, reporterController.updateReporter);
router.delete('/:id', verifyEditorToken, reporterController.deleteReporter);

module.exports = router; 