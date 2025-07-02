import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faEnvelope, 
  faCheck, 
  faEye,
  faExclamationTriangle,
  faInfoCircle,
  faBullhorn,
  faTasks
} from '@fortawesome/free-solid-svg-icons';
import adminUserService, { type AdminMessage } from '../../api/adminUserService';
import { useAuth } from '../../context/AuthContext';

const UserNotificationPanel: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchUnreadCount();
      
      // Poll for new messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesData = await adminUserService.getUserMessages(false, 1, 10);
      setMessages(messagesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await adminUserService.getUnreadMessageCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await adminUserService.markMessageAsRead(messageId);
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const getMessageIcon = (messageType: string) => {
    switch (messageType) {
      case 'Task':
        return faTasks;
      case 'Alert':
        return faExclamationTriangle;
      case 'Announcement':
        return faBullhorn;
      default:
        return faInfoCircle;
    }
  };

  const getMessageVariant = (messageType: string) => {
    switch (messageType) {
      case 'Task':
        return 'warning';
      case 'Alert':
        return 'danger';
      case 'Announcement':
        return 'info';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dropdown 
      show={showDropdown} 
      onToggle={setShowDropdown}
      align="end"
    >
      <Dropdown.Toggle 
        variant="outline-secondary" 
        id="notification-dropdown"
        className="position-relative border-0"
        style={{ background: 'transparent' }}
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
        <div className="px-3 py-2 border-bottom">
          <h6 className="mb-0">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Messages
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">{unreadCount} unread</Badge>
            )}
          </h6>
        </div>

        {error && (
          <div className="px-3 py-2">
            <Alert variant="danger" className="mb-0 py-2">
              <small>{error}</small>
            </Alert>
          </div>
        )}

        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="px-3 py-3 text-center text-muted">
            <FontAwesomeIcon icon={faEnvelope} className="mb-2" size="2x" />
            <p className="mb-0">No messages</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {messages.map((message) => (
              <ListGroup.Item 
                key={message.id}
                className={`px-3 py-2 ${!message.isRead ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <FontAwesomeIcon 
                        icon={getMessageIcon(message.messageType)} 
                        className={`me-2 text-${getMessageVariant(message.messageType)}`}
                      />
                      <Badge bg={getMessageVariant(message.messageType)} className="me-2">
                        {message.messageType}
                      </Badge>
                      {!message.isRead && (
                        <Badge bg="primary" className="me-2">New</Badge>
                      )}
                    </div>
                    
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                      {message.subject}
                    </h6>
                    
                    <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
                      {message.message.length > 100 
                        ? `${message.message.substring(0, 100)}...` 
                        : message.message
                      }
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        From: {message.fromUserName}
                      </small>
                      <small className="text-muted">
                        {formatDate(message.createdAt)}
                      </small>
                    </div>
                  </div>
                  
                  {!message.isRead && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id);
                      }}
                      title="Mark as read"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {messages.length > 0 && (
          <div className="px-3 py-2 border-top text-center">
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => {
                setShowDropdown(false);
                // Navigate to full messages page if implemented
              }}
            >
              View All Messages
            </Button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserNotificationPanel;
