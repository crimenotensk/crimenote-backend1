const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let editorToken = '';

async function testEndpoints() {
  try {
    // 1. Test Registration
    console.log('\n1. Testing Editor Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/editors/register`, {
      fullName: 'Rahul Sharma',
      email: 'rahul@crimenote.com',
      password: 'Test@123',
      mobileNumber: '9876543210',
      category: 'crime'
    });
    console.log('Registration Response:', registerResponse.data);

    // 2. Test Login
    console.log('\n2. Testing Editor Login...');
    const loginResponse = await axios.post(`${BASE_URL}/editors/login`, {
      email: 'rahul@crimenote.com',
      password: 'Test@123'
    });
    editorToken = loginResponse.data.token;
    console.log('Login Response:', loginResponse.data);

    // 3. Test Protected Route - Create Article
    console.log('\n3. Testing Create Article...');
    const createArticleResponse = await axios.post(
      `${BASE_URL}/news`,
      {
        title: 'Test Article',
        titleMarathi: 'चाचणी लेख',
        content: 'This is a test article',
        contentMarathi: 'हा एक चाचणी लेख आहे',
        category: 'crime',
        location: 'Mumbai',
        author: 'Rahul Sharma',
        tags: ['test', 'crime']
      },
      {
        headers: { Authorization: `Bearer ${editorToken}` }
      }
    );
    console.log('Create Article Response:', createArticleResponse.data);

  } catch (error) {
    console.error('Error Details:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error('Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

// Add delay before starting tests to ensure server is ready
setTimeout(() => {
  console.log('Starting endpoint tests...');
  testEndpoints();
}, 2000); 