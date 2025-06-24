const express = require('express');
const router = express.Router();

// Simple mock summary route
router.post('/', (req, res) => {
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Content is required' });

  // Remove HTML tags and split into sentences
  const text = content.replace(/<[^>]*>?/gm, '');
  const sentences = text.split(/[.?!]\s+/).filter(Boolean);
  const summary = sentences.slice(0, 2).join('. ') + '.';

  res.json({ summary });
});

module.exports = router; 