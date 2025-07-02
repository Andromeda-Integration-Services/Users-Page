import React from 'react';

const AdminUsersPageSimple: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management Page</h1>
      <p>This is a simple test to verify the page loads.</p>
      <p>If you can see this, the routing is working correctly.</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Information:</h3>
        <p>Current URL: {window.location.pathname}</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminUsersPageSimple;
