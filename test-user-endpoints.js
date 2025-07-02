// Test script to verify user registration and dropdown functionality
const baseUrl = 'http://localhost:5000/api';

// Test data for new user registration
const testUser = {
  email: `testuser${Date.now()}@cafm.com`,
  password: 'TestUser123!',
  confirmPassword: 'TestUser123!',
  firstName: 'Test',
  lastName: 'User',
  department: 'IT',
  employeeId: `TEST${Date.now()}`,
  role: 'EndUser'
};

async function testUserRegistration() {
  console.log('🧪 Testing User Registration...');
  console.log('Test user data:', testUser);
  
  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    console.log('Registration response:', data);

    if (data.success) {
      console.log('✅ User registration successful!');
      return data.token;
    } else {
      console.log('❌ User registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

async function testGetRegisteredUsers(token = null) {
  console.log('\n🧪 Testing Get Registered Users...');
  
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/users/registered`, {
      method: 'GET',
      headers: headers,
    });

    if (response.ok) {
      const users = await response.json();
      console.log('✅ Successfully fetched registered users:');
      console.log(`Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.fullName} (${user.email}) - ${user.department}`);
      });
      return users;
    } else {
      console.log('❌ Failed to fetch users:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('Error details:', errorData);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
}

async function testLoginAndGetUsers() {
  console.log('\n🧪 Testing Login with Admin Account...');
  
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@cafm.com',
        password: 'Admin123!'
      }),
    });

    const data = await response.json();
    
    if (data.success && data.token) {
      console.log('✅ Admin login successful!');
      return data.token;
    } else {
      console.log('❌ Admin login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting User Registration and Dropdown Tests...\n');
  
  // Test 1: Get users with admin token
  const adminToken = await testLoginAndGetUsers();
  if (adminToken) {
    await testGetRegisteredUsers(adminToken);
  }
  
  // Test 2: Register new user
  const userToken = await testUserRegistration();
  
  // Test 3: Get users again to see if new user appears
  if (adminToken) {
    console.log('\n🧪 Checking if new user appears in the list...');
    await testGetRegisteredUsers(adminToken);
  }
  
  console.log('\n✅ Tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Check the frontend registration form at http://localhost:5173/register');
  console.log('2. Try creating a ticket and check if users appear in dropdown');
  console.log('3. Verify real-time updates when new users register');
}

// Run the tests
runTests().catch(console.error);
