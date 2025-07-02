// Test script to verify role-based access control for tickets
const baseUrl = 'http://localhost:5000/api';

// Test user credentials
const testUsers = {
  admin: { email: 'admin@cafm.com', password: 'Admin123!' },
  plumber: { email: 'plumber@cafm.com', password: 'Plumber123!' },
  electrician: { email: 'electrician@cafm.com', password: 'Electric123!' },
  cleaner: { email: 'cleaner@cafm.com', password: 'Cleaner123!' },
  enduser: { email: 'user@cafm.com', password: 'User123!' }
};

// Function to login and get JWT token
async function login(email, password) {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(`Login error for ${email}:`, error.message);
    return null;
  }
}

// Function to get tickets with authentication
async function getTickets(token, userRole) {
  try {
    const response = await fetch(`${baseUrl}/tickets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get tickets failed: ${response.status}`);
    }

    const data = await response.json();
    return data.tickets || [];
  } catch (error) {
    console.error(`Get tickets error for ${userRole}:`, error.message);
    return [];
  }
}

// Function to test role-based access
async function testRoleBasedAccess() {
  console.log('=== TESTING ROLE-BASED ACCESS CONTROL ===\n');

  for (const [role, credentials] of Object.entries(testUsers)) {
    console.log(`\n--- Testing ${role.toUpperCase()} access ---`);
    
    // Login
    const token = await login(credentials.email, credentials.password);
    if (!token) {
      console.log(`❌ Failed to login as ${role}`);
      continue;
    }
    console.log(`✅ Successfully logged in as ${role}`);

    // Get tickets
    const tickets = await getTickets(token, role);
    console.log(`📋 ${role} can see ${tickets.length} tickets:`);

    // Display ticket details
    if (tickets.length > 0) {
      tickets.forEach(ticket => {
        console.log(`   - ID: ${ticket.id}, Title: ${ticket.title}`);
        console.log(`     Category: ${ticket.categoryText}, Assigned: ${ticket.assignedToUserName || 'Unassigned'}`);
        console.log(`     Created by: ${ticket.createdByUserName}`);
      });
    } else {
      console.log('   (No tickets visible)');
    }

    // Analyze access patterns
    analyzeAccess(role, tickets);
  }

  console.log('\n=== TEST COMPLETE ===');
}

// Function to analyze access patterns
function analyzeAccess(role, tickets) {
  const testTickets = tickets.filter(t => t.title.includes('[TEST]'));
  
  console.log(`\n🔍 Analysis for ${role.toUpperCase()}:`);
  console.log(`   Total tickets: ${tickets.length}`);
  console.log(`   Test tickets: ${testTickets.length}`);

  if (role === 'admin') {
    console.log(`   ✅ Admin should see ALL tickets - ${tickets.length > 0 ? 'PASS' : 'FAIL'}`);
  } else if (role === 'plumber') {
    const plumbingTickets = testTickets.filter(t => 
      t.categoryText === 'Plumbing' || t.createdByUserEmail === 'plumber@cafm.com'
    );
    const nonPlumbingTickets = testTickets.filter(t => 
      t.categoryText !== 'Plumbing' && t.createdByUserEmail !== 'plumber@cafm.com'
    );
    console.log(`   ✅ Should see plumbing tickets: ${plumbingTickets.length}`);
    console.log(`   ${nonPlumbingTickets.length === 0 ? '✅' : '❌'} Should NOT see non-plumbing tickets: ${nonPlumbingTickets.length}`);
  } else if (role === 'electrician') {
    const electricalTickets = testTickets.filter(t => 
      t.categoryText === 'Electrical' || t.createdByUserEmail === 'electrician@cafm.com'
    );
    const nonElectricalTickets = testTickets.filter(t => 
      t.categoryText !== 'Electrical' && t.createdByUserEmail !== 'electrician@cafm.com'
    );
    console.log(`   ✅ Should see electrical tickets: ${electricalTickets.length}`);
    console.log(`   ${nonElectricalTickets.length === 0 ? '✅' : '❌'} Should NOT see non-electrical tickets: ${nonElectricalTickets.length}`);
  } else if (role === 'cleaner') {
    const cleaningTickets = testTickets.filter(t => 
      t.categoryText === 'Cleaning' || t.createdByUserEmail === 'cleaner@cafm.com'
    );
    const nonCleaningTickets = testTickets.filter(t => 
      t.categoryText !== 'Cleaning' && t.createdByUserEmail !== 'cleaner@cafm.com'
    );
    console.log(`   ✅ Should see cleaning tickets: ${cleaningTickets.length}`);
    console.log(`   ${nonCleaningTickets.length === 0 ? '✅' : '❌'} Should NOT see non-cleaning tickets: ${nonCleaningTickets.length}`);
  } else if (role === 'enduser') {
    const ownTickets = testTickets.filter(t => t.createdByUserEmail === 'user@cafm.com');
    const otherTickets = testTickets.filter(t => t.createdByUserEmail !== 'user@cafm.com');
    console.log(`   ✅ Should see own tickets: ${ownTickets.length}`);
    console.log(`   ${otherTickets.length === 0 ? '✅' : '❌'} Should NOT see other users' tickets: ${otherTickets.length}`);
  }
}

// Run the test
testRoleBasedAccess().catch(console.error);
