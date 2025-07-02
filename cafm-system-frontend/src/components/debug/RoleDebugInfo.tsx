import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleDebugInfo - A debug component to show current user roles and routing logic
 * This helps verify that role-based routing is working correctly
 */
const RoleDebugInfo: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Debug:</strong> No user logged in
      </div>
    );
  }

  const isServiceProvider = hasRole('Plumber') || hasRole('Electrician') || hasRole('Cleaner');
  const isAdmin = hasRole('Admin');
  const isManager = hasRole('AssetManager');

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
      <h4 className="font-bold mb-2">🔍 Role Debug Information</h4>
      <div className="text-sm">
        <p><strong>User:</strong> {user.firstName} {user.lastName} ({user.email})</p>
        <p><strong>Roles:</strong> {user.roles?.join(', ') || 'No roles'}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <hr className="my-2" />
        <p><strong>Role Checks:</strong></p>
        <ul className="list-disc list-inside ml-4">
          <li>Is Admin: {isAdmin ? '✅ YES' : '❌ NO'}</li>
          <li>Is Asset Manager: {isManager ? '✅ YES' : '❌ NO'}</li>
          <li>Is Service Provider: {isServiceProvider ? '✅ YES' : '❌ NO'}</li>
          <li>Is Plumber: {hasRole('Plumber') ? '✅ YES' : '❌ NO'}</li>
          <li>Is Electrician: {hasRole('Electrician') ? '✅ YES' : '❌ NO'}</li>
          <li>Is Cleaner: {hasRole('Cleaner') ? '✅ YES' : '❌ NO'}</li>
        </ul>
        <hr className="my-2" />
        <p><strong>Expected Interface:</strong> 
          {isAdmin ? ' Admin Dashboard' : 
           isManager ? ' Manager Dashboard' : 
           isServiceProvider ? ' 🎨 Professional Interface' : 
           ' Standard User Interface'}
        </p>
      </div>
    </div>
  );
};

export default RoleDebugInfo;
