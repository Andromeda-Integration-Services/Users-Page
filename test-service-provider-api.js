// Test script to verify service provider role-based access to API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials for service providers
const testUsers = [
    { email: 'plumber@cafm.com', password: 'Plumber123!', role: 'Plumber' },
    { email: 'electrician@cafm.com', password: 'Electrician123!', role: 'Electrician' },
    { email: 'cleaner@cafm.com', password: 'Cleaner123!', role: 'Cleaner' },
    { email: 'admin@cafm.com', password: 'Admin123!', role: 'Admin' }
];

// Function to login and get token
async function login(email, password) {
    try {
        console.log(`\n🔐 Logging in as ${email}...`);
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email,
            password
        });

        if (response.data.success && response.data.token) {
            console.log(`✅ Login successful for ${email}`);
            console.log(`   User ID: ${response.data.user.id}`);
            console.log(`   Roles: ${response.data.user.roles.join(', ')}`);
            return {
                token: response.data.token,
                userId: response.data.user.id,
                roles: response.data.user.roles,
                email: response.data.user.email
            };
        } else {
            console.log(`❌ Login failed for ${email}: ${response.data.message}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ Login error for ${email}:`, error.response?.data?.message || error.message);
        return null;
    }
}

// Function to test API endpoint
async function testEndpoint(token, endpoint, userInfo) {
    try {
        console.log(`\n📡 Testing ${endpoint} for ${userInfo.email} (${userInfo.roles.join(', ')})...`);
        
        const response = await axios.get(`${API_BASE}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const data = response.data;
            
            if (endpoint === '/tickets') {
                console.log(`✅ Tickets endpoint successful`);
                console.log(`   Total tickets returned: ${data.tickets?.length || 0}`);
                console.log(`   Total count: ${data.totalCount || 0}`);
                
                if (data.tickets && data.tickets.length > 0) {
                    console.log(`   Sample tickets:`);
                    data.tickets.slice(0, 3).forEach((ticket, index) => {
                        console.log(`     ${index + 1}. ID: ${ticket.id}, Title: "${ticket.title}"`);
                        console.log(`        Category: ${ticket.categoryText}, Type: ${ticket.typeText}`);
                        console.log(`        Assigned to: ${ticket.assignedToUserName || 'Unassigned'}`);
                        console.log(`        Created by: ${ticket.createdByUserName}`);
                    });
                }
            } else if (endpoint === '/tickets/stats') {
                console.log(`✅ Stats endpoint successful`);
                console.log(`   Total tickets: ${data.totalTickets || 0}`);
                console.log(`   Open tickets: ${data.openTickets || 0}`);
                console.log(`   In progress: ${data.inProgressTickets || 0}`);
                console.log(`   Completed: ${data.completedTickets || 0}`);
            }
        }
        
        return response.data;
    } catch (error) {
        console.log(`❌ Error testing ${endpoint}:`, error.response?.data?.message || error.message);
        console.log(`   Status: ${error.response?.status}`);
        return null;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Service Provider API Access Test');
    console.log('='.repeat(60));

    for (const user of testUsers) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🧪 Testing user: ${user.email} (${user.role})`);
        console.log(`${'='.repeat(60)}`);

        // Login
        const authInfo = await login(user.email, user.password);
        if (!authInfo) {
            console.log(`❌ Skipping tests for ${user.email} due to login failure`);
            continue;
        }

        // Test endpoints
        await testEndpoint(authInfo.token, '/tickets', authInfo);
        await testEndpoint(authInfo.token, '/tickets/stats', authInfo);
        
        // Add a small delay between users
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('🏁 Test completed');
    console.log(`${'='.repeat(60)}`);
}

// Run the tests
runTests().catch(error => {
    console.error('❌ Test script error:', error.message);
    process.exit(1);
});
