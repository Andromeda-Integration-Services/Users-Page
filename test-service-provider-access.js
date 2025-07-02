// Test script to verify service provider role-based access
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials for service providers
const testUsers = [
    { email: 'plumber@cafm.com', password: 'Plumber123!', role: 'Plumber' },
    { email: 'electrician@cafm.com', password: 'Electrician123!', role: 'Electrician' },
    { email: 'cleaner@cafm.com', password: 'Cleaner123!', role: 'Cleaner' },
    { email: 'admin@cafm.com', password: 'Admin123!', role: 'Admin' }
];

async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email,
            password
        });
        
        if (response.data.success) {
            return response.data.token;
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        console.error(`❌ Login failed for ${email}:`, error.response?.data?.message || error.message);
        return null;
    }
}

async function getTickets(token, userRole) {
    try {
        const response = await axios.get(`${API_BASE}/tickets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`✅ ${userRole} - Tickets fetched successfully: ${response.data.tickets.length} tickets`);
        
        // Log first few tickets for debugging
        response.data.tickets.slice(0, 3).forEach(ticket => {
            console.log(`   - Ticket ${ticket.id}: ${ticket.title} (Category: ${ticket.categoryText}, Assigned: ${ticket.assignedToUserName || 'Unassigned'})`);
        });
        
        return response.data;
    } catch (error) {
        console.error(`❌ ${userRole} - Failed to fetch tickets:`, error.response?.data?.message || error.message);
        return null;
    }
}

async function getTicketStats(token, userRole) {
    try {
        const response = await axios.get(`${API_BASE}/tickets/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`✅ ${userRole} - Stats fetched successfully:`, {
            totalTickets: response.data.totalTickets,
            openTickets: response.data.openTickets,
            inProgressTickets: response.data.inProgressTickets
        });
        
        return response.data;
    } catch (error) {
        console.error(`❌ ${userRole} - Failed to fetch stats:`, error.response?.data?.message || error.message);
        return null;
    }
}

async function testServiceProviderAccess() {
    console.log('🔍 Testing Service Provider Role-Based Access...\n');
    
    for (const user of testUsers) {
        console.log(`\n📋 Testing ${user.role} (${user.email}):`);
        console.log('=' .repeat(50));
        
        // Login
        const token = await loginUser(user.email, user.password);
        if (!token) {
            console.log(`❌ Skipping ${user.role} - login failed\n`);
            continue;
        }
        
        console.log(`✅ Login successful for ${user.role}`);
        
        // Test tickets endpoint
        await getTickets(token, user.role);
        
        // Test stats endpoint
        await getTicketStats(token, user.role);
        
        console.log(''); // Empty line for readability
    }
}

// Run the test
testServiceProviderAccess().catch(console.error);
