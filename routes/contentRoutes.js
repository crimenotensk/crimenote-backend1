const express = require('express');
const router = express.Router();
const { verifyEditorToken } = require('../middleware/authMiddleware');

// Temporary storage (replace with database in production)
let contents = [];

// Create new content - protected route
router.post('/', verifyEditorToken, (req, res) => {
    try {
        const newContent = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
            editorId: req.user.id // Add editor ID from auth token
        };
        
        contents.push(newContent);
        
        res.status(201).json({
            success: true,
            message: `${req.body.type} created successfully`,
            data: newContent
        });
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create content',
            error: error.message
        });
    }
});

// Get all content - protected route
router.get('/', verifyEditorToken, (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: contents
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch content',
            error: error.message
        });
    }
});

module.exports = router; 