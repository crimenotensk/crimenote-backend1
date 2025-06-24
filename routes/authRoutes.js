const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Editor = require('../models/Editor');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const editor = await Editor.findOne({ email });
        if (!editor) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, editor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: editor._id,
                email: editor.email,
                role: editor.role,
                name: editor.name
            },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: editor._id,
                name: editor.name,
                email: editor.email,
                role: editor.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router; 