import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * SimpleChatButton - A safe, minimal chatbot implementation
 * This is a much simpler version that won't cause any import issues
 */
const SimpleChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Only show on authenticated pages
  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateTicket = () => {
    navigate('/tickets/new');
    setIsOpen(false);
  };

  const handleViewTickets = () => {
    navigate('/tickets');
    setIsOpen(false);
  };

  return (
    <>
      {/* Simple Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '320px',
          height: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          zIndex: 9998,
          border: '1px solid #e9ecef',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h6 style={{ margin: 0, fontSize: '16px' }}>CAFM Assistant</h6>
              <small style={{ opacity: 0.8, fontSize: '12px' }}>How can I help you?</small>
            </div>
            <button
              onClick={handleToggle}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h6>Hi {user?.firstName}! 👋</h6>
              <p style={{ color: '#6c757d', fontSize: '14px', margin: '8px 0' }}>
                I'm here to help you with facility management tasks.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <button
                onClick={handleCreateTicket}
                style={{
                  background: 'linear-gradient(135deg, #007bff, #0056b3)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🎫 Create New Ticket
              </button>

              <button
                onClick={handleViewTickets}
                style={{
                  background: '#f8f9fa',
                  color: '#495057',
                  border: '1px solid #e9ecef',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📋 View My Tickets
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <small style={{ color: '#6c757d', fontSize: '12px' }}>
                Need help? Just click the buttons above!
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={handleToggle}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Chat with CAFM Assistant"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
        </button>
      </div>
    </>
  );
};

export default SimpleChatButton;
