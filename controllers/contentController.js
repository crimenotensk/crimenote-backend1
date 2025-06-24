const Content = require('../models/Content');

// Create new content
exports.createContent = async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json({ 
      success: true, 
      message: `${req.body.type} created successfully`, 
      data: content 
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create content', 
      error: error.message 
    });
  }
};

// Get all content
exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      data: content 
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content', 
      error: error.message 
    });
  }
}; 