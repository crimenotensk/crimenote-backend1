const Reporter = require('../models/Reporter');

// Add new reporter (Admin only)
exports.createReporter = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.editor || !req.editor.isAdmin) {
      return res.status(403).json({
        message: 'या क्रियेसाठी प्रशासक प्रवेश आवश्यक आहे.'
      });
    }

    const reporter = new Reporter(req.body);
    await reporter.save();

    res.status(201).json({
      message: 'बातमीदार यशस्वीरित्या जोडला गेला.',
      reporter
    });
  } catch (error) {
    console.error('Error creating reporter:', error);
    res.status(400).json({
      message: 'बातमीदार जोडताना त्रुटी आली.',
      error: error.message
    });
  }
};

// Update reporter (Admin only)
exports.updateReporter = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.editor || !req.editor.isAdmin) {
      return res.status(403).json({
        message: 'या क्रियेसाठी प्रशासक प्रवेश आवश्यक आहे.'
      });
    }

    const reporter = await Reporter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!reporter) {
      return res.status(404).json({
        message: 'बातमीदार सापडला नाही.'
      });
    }

    res.json({
      message: 'बातमीदाराची माहिती यशस्वीरित्या अपडेट केली.',
      reporter
    });
  } catch (error) {
    console.error('Error updating reporter:', error);
    res.status(400).json({
      message: 'बातमीदाराची माहिती अपडेट करताना त्रुटी आली.',
      error: error.message
    });
  }
};

// Delete reporter (Admin only)
exports.deleteReporter = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.editor || !req.editor.isAdmin) {
      return res.status(403).json({
        message: 'या क्रियेसाठी प्रशासक प्रवेश आवश्यक आहे.'
      });
    }

    const reporter = await Reporter.findByIdAndDelete(req.params.id);

    if (!reporter) {
      return res.status(404).json({
        message: 'बातमीदार सापडला नाही.'
      });
    }

    res.json({
      message: 'बातमीदार यशस्वीरित्या काढून टाकला.',
      reporterId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting reporter:', error);
    res.status(500).json({
      message: 'बातमीदार काढून टाकताना त्रुटी आली.',
      error: error.message
    });
  }
};

// Get all reporters (Public)
exports.getAllReporters = async (req, res) => {
  try {
    const reporters = await Reporter.find()
      .sort({ name: 1 }); // Sort alphabetically by name

    res.json({
      count: reporters.length,
      reporters
    });
  } catch (error) {
    console.error('Error fetching reporters:', error);
    res.status(500).json({
      message: 'बातमीदारांची यादी आणताना त्रुटी आली.',
      error: error.message
    });
  }
}; 