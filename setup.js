const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Editor = require('./models/Editor');
require('dotenv').config();

async function createDefaultUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crimenote');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new Editor({
      name: 'Admin User',
      email: 'admin@crimenote.com',
      password: adminPassword,
      role: 'admin',
      approved: true
    });

    // Create editor user
    const editorPassword = await bcrypt.hash('Editor@123', 10);
    const editor = new Editor({
      name: 'Editor User',
      email: 'editor@crimenote.com',
      password: editorPassword,
      role: 'editor',
      approved: true
    });

    // Save users
    await Editor.deleteMany({}); // Clear existing users
    await admin.save();
    await editor.save();

    console.log('Default users created successfully:');
    console.log('Admin - email: admin@crimenote.com, password: Admin@123');
    console.log('Editor - email: editor@crimenote.com, password: Editor@123');

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating default users:', error);
    process.exit(1);
  }
}

createDefaultUsers(); 