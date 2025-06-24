const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Editor = require('../models/Editor');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    const existingUser = await Editor.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Editor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEditor = new Editor({
      name,
      email,
      password: hashedPassword,
      city
    });

    await newEditor.save();

    res.status(201).json({ message: 'Signup successful. Waiting for admin approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const editor = await Editor.findOne({ email });

    if (!editor) return res.status(404).json({ message: 'Editor not found' });
    if (!editor.approved) return res.status(401).json({ message: 'Awaiting admin approval' });

    const isMatch = await bcrypt.compare(password, editor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: editor._id, role: editor.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, editor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all editors (admin use)
exports.getAllEditors = async (req, res) => {
  try {
    const editors = await Editor.find().select('-password');
    res.json(editors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Editor (admin only)
exports.approveEditor = async (req, res) => {
  try {
    const { id } = req.params;
    const editor = await Editor.findByIdAndUpdate(id, { approved: true }, { new: true });
    res.json(editor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
