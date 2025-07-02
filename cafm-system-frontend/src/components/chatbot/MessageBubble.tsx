import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faTicketAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './MessageBubble.css';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'ticket-suggestion';
  data?: any;
}

interface MessageBubbleProps {
  message: Message;
  theme: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, theme }) => {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateTicket = () => {
    navigate('/tickets/new');
  };

  const handleViewTickets = () => {
    navigate('/tickets');
  };

  const renderMessageContent = () => {
    const lines = message.text.split('\n');
    
    return (
      <div className="message-content">
        {lines.map((line, index) => (
          <div key={index} className="message-line">
            {line}
          </div>
        ))}
        
        {/* Add action buttons for ticket suggestions */}
        {message.type === 'ticket-suggestion' && message.isBot && (
          <div className="message-actions">
            <button 
              className={`action-btn primary ${theme}`}
              onClick={handleCreateTicket}
            >
              <FontAwesomeIcon icon={faTicketAlt} className="me-1" />
              Create Ticket
            </button>
            <button 
              className="action-btn secondary"
              onClick={handleViewTickets}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="me-1" />
              View All Tickets
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`message-bubble ${message.isBot ? 'bot' : 'user'}`}>
      <div className="message-wrapper">
        {/* Avatar */}
        <div className={`message-avatar ${message.isBot ? 'bot' : 'user'}`}>
          <FontAwesomeIcon 
            icon={message.isBot ? faRobot : faUser} 
            className="avatar-icon"
          />
        </div>
        
        {/* Message */}
        <div className={`message-container ${message.isBot ? 'bot' : 'user'} ${theme}`}>
          {renderMessageContent()}
          <div className="message-time">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
