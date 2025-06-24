const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let testReporterId = '';

async function testReporterEndpoints() {
  try {
    // 1. Register an editor
    console.log('\n1. Testing Editor Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/editors/register`, {
      fullName: 'Admin Editor',
      email: 'admin@crimenote.com',
      password: 'Admin@123',
      mobileNumber: '9876543210',
      category: 'crime'
    });
    console.log('Registration Response:', registerResponse.data);

    // 2. Make the editor an admin using MongoDB directly
    console.log('\n2. Making editor an admin...');
    await mongoose.connect(process.env.MONGODB_URI);
    const Editor = mongoose.model('Editor');
    await Editor.findOneAndUpdate(
      { email: 'admin@crimenote.com' },
      { 
        $set: { 
          isAdmin: true,
          isApproved: true
        } 
      }
    );
    console.log('Editor updated to admin successfully');

    // 3. Login as admin
    console.log('\n3. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/editors/login`, {
      email: 'admin@crimenote.com',
      password: 'Admin@123'
    });
    adminToken = loginResponse.data.token;
    console.log('Login Response:', loginResponse.data);

    // 4. Create a new reporter
    console.log('\n4. Testing Create Reporter...');
    const createReporterResponse = await axios.post(
      `${BASE_URL}/reporters`,
      {
        name: 'Rajesh Patil',
        designation: 'Senior Reporter',
        city: 'Mumbai',
        photoUrl: 'https://example.com/photo.jpg'
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    testReporterId = createReporterResponse.data.reporter._id;
    console.log('Create Reporter Response:', createReporterResponse.data);

    // 5. Get all reporters (public route)
    console.log('\n5. Testing Get All Reporters...');
    const getAllResponse = await axios.get(`${BASE_URL}/reporters`);
    console.log('Get All Reporters Response:', getAllResponse.data);

    // 6. Update reporter
    console.log('\n6. Testing Update Reporter...');
    const updateResponse = await axios.put(
      `${BASE_URL}/reporters/${testReporterId}`,
      {
        designation: 'Chief Reporter',
        city: 'Pune'
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    console.log('Update Reporter Response:', updateResponse.data);

    // 7. Delete reporter
    console.log('\n7. Testing Delete Reporter...');
    const deleteResponse = await axios.delete(
      `${BASE_URL}/reporters/${testReporterId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    console.log('Delete Reporter Response:', deleteResponse.data);

    // 8. Verify reporter was deleted
    console.log('\n8. Verifying reporter deletion...');
    const finalCheckResponse = await axios.get(`${BASE_URL}/reporters`);
    console.log('Final Check Response:', finalCheckResponse.data);

  } catch (error) {
    console.error('\nError Details:');
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
  } finally {
    // Clean up MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    }
  }
}

// Add delay before starting tests to ensure server is ready
setTimeout(() => {
  console.log('Starting reporter endpoint tests...');
  testReporterEndpoints();
}, 2000); 