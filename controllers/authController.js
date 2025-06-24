const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Editor = require('../models/Editor');

// Register new editor
exports.register = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Check if editor already exists
    const existingEditor = await Editor.findOne({ email });
    if (existingEditor) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new editor
    const editor = new Editor({
      name,
      email,
      password: hashedPassword,
      city,
      role: 'editor' // Default role
    });

    await editor.save();

    // Create token
    const token = jwt.sign(
      { id: editor._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: editor._id,
        name: editor.name,
        email: editor.email,
        role: editor.role,
        city: editor.city
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login editor
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if editor exists
    const editor = await Editor.findOne({ email });
    if (!editor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if editor is approved
    if (!editor.approved) {
      return res.status(403).json({
        success: false,
        message: 'Account pending approval'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, editor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: editor._id },
      process.env.JWT_SECRET,
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
        role: editor.role,
        city: editor.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
}; 