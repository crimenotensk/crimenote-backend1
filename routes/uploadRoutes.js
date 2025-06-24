const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only jpg, png, mp4, and webm files are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Determine resource type based on mimetype
    const resourceType = file.mimetype.startsWith('image') ? 'image' : 'video';

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
    });

    // Delete the temporary file
    fs.unlinkSync(file.path);

    res.status(200).json({
      url: result.secure_url,
      type: resourceType,
    });
  } catch (err) {
    // Clean up temporary file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

module.exports = router; 