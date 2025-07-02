import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>🧪 Test Page - Application Status</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Authentication Status</h2>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Is Loading:</strong> {isLoading ? '⏳ YES' : '✅ NO'}</p>
        
        {user ? (
          <div>
            <h3>User Information</h3>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {user.roles?.join(', ') || 'No roles'}</p>
            <p><strong>Department:</strong> {user.department}</p>
          </div>
        ) : (
          <p><strong>User:</strong> Not logged in</p>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Application Status</h2>
        <p>✅ React is rendering correctly</p>
        <p>✅ Routing is working</p>
        <p>✅ AuthContext is accessible</p>
        <p>✅ No critical JavaScript errors</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ marginRight: '10px' }}>← Back to Home</a>
        <a href="/login" style={{ marginRight: '10px' }}>Go to Login</a>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    </div>
  );
};

export default TestPage;
