import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

/**
 * SuperSimpleChatButton - Testing with authentication hooks
 * Adding useAuth to see if that's the issue
 */
const SuperSimpleChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Only show if authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Simple Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '300px',
          height: '200px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          zIndex: 9998,
          border: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h6>Hi {user?.firstName}! 👋</h6>
          <p style={{ color: '#6c757d', fontSize: '14px', textAlign: 'center' }}>
            Authentication is working!<br/>
            User: {user?.email}<br/>
            Click the button to close.
          </p>
        </div>
      )}

      {/* Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={handleClick}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          title="Test React Hooks"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
        </button>
      </div>
    </>
  );
};

export default SuperSimpleChatButton;
