// Debug script to isolate the service provider issue
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function debugServiceProviderIssue() {
    console.log('🔍 Debugging Service Provider Issue');
    console.log('='.repeat(50));

    // Test 1: Login as plumber
    console.log('\n1️⃣ Testing Plumber Login...');
    try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'plumber@cafm.com',
            password: 'Plumber123!'
        });

        if (loginResponse.data.success) {
            console.log('✅ Plumber login successful');
            const token = loginResponse.data.token;
            const userId = loginResponse.data.user.id;
            
            // Test 2: Try to get a specific ticket by ID (should work if ticket exists and is accessible)
            console.log('\n2️⃣ Testing specific ticket access...');
            try {
                // First, let's try to get tickets as admin to see what tickets exist
                const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
                    email: 'admin@cafm.com',
                    password: 'Admin123!'
                });
                
                if (adminLogin.data.success) {
                    const adminToken = adminLogin.data.token;
                    const adminTickets = await axios.get(`${API_BASE}/tickets`, {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    });
                    
                    console.log(`📊 Admin can see ${adminTickets.data.totalCount} total tickets`);
                    
                    // Find a plumbing ticket that should be visible to plumber
                    const plumbingTickets = adminTickets.data.tickets.filter(t => 
                        t.categoryText === 'Plumbing' || t.assignedToUserId === userId
                    );
                    
                    console.log(`🔧 Found ${plumbingTickets.length} plumbing tickets or tickets assigned to plumber`);
                    
                    if (plumbingTickets.length > 0) {
                        const testTicket = plumbingTickets[0];
                        console.log(`🎯 Testing access to ticket ID ${testTicket.id}: "${testTicket.title}"`);
                        console.log(`   Category: ${testTicket.categoryText}, Assigned to: ${testTicket.assignedToUserName || 'Unassigned'}`);
                        
                        // Test plumber access to this specific ticket
                        try {
                            const ticketResponse = await axios.get(`${API_BASE}/tickets/${testTicket.id}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            console.log('✅ Plumber can access specific plumbing ticket');
                        } catch (error) {
                            console.log('❌ Plumber cannot access specific plumbing ticket:', error.response?.data?.message);
                            console.log('   Status:', error.response?.status);
                        }
                    } else {
                        console.log('⚠️ No plumbing tickets found for testing');
                    }
                }
            } catch (error) {
                console.log('❌ Error in specific ticket test:', error.message);
            }

            // Test 3: Try tickets endpoint with detailed error logging
            console.log('\n3️⃣ Testing tickets endpoint with error details...');
            try {
                const response = await axios.get(`${API_BASE}/tickets`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 10000
                });
                console.log('✅ Tickets endpoint successful');
                console.log(`   Returned ${response.data.tickets?.length || 0} tickets`);
            } catch (error) {
                console.log('❌ Tickets endpoint failed');
                console.log('   Status:', error.response?.status);
                console.log('   Message:', error.response?.data?.message || error.message);
                console.log('   Full error data:', JSON.stringify(error.response?.data, null, 2));
            }

            // Test 4: Try stats endpoint
            console.log('\n4️⃣ Testing stats endpoint...');
            try {
                const response = await axios.get(`${API_BASE}/tickets/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 10000
                });
                console.log('✅ Stats endpoint successful');
                console.log(`   Total tickets: ${response.data.totalTickets || 0}`);
            } catch (error) {
                console.log('❌ Stats endpoint failed');
                console.log('   Status:', error.response?.status);
                console.log('   Message:', error.response?.data?.message || error.message);
            }

        } else {
            console.log('❌ Plumber login failed');
        }
    } catch (error) {
        console.log('❌ Login error:', error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🏁 Debug completed');
}

debugServiceProviderIssue().catch(console.error);
