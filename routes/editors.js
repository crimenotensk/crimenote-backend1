const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getAllEditors,
  approveEditor
} = require('../controllers/editorController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Admin-only routes
router.get('/', [verifyToken, requireRole('admin')], getAllEditors);
router.put('/approve/:id', [verifyToken, requireRole('admin')], approveEditor);

module.exports = router;
