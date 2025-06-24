const express = require('express');
const City = require('../models/City');

const router = express.Router();

// GET all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// POST a new city
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'City name is required' });

  try {
    // Avoid duplicates
    const existing = await City.findOne({ name });
    if (existing) return res.status(409).json({ error: 'City already exists' });

    const city = new City({ name });
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add city' });
  }
});

module.exports = router; 