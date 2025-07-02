import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faMinimize } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from './ChatWindow';
import './ChatWidget.css';

interface ChatWidgetProps {
  isEnabled?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'primary' | 'secondary' | 'success';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isEnabled = true, 
  position = 'bottom-right',
  theme = 'primary'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setHasNewMessage(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setHasNewMessage(true);
    }
  };

  const positionClass = position === 'bottom-right' ? 'chat-widget-bottom-right' : 'chat-widget-bottom-left';

  return (
    <>
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className={`chat-window ${positionClass}`}>
          <ChatWindow 
            onClose={handleToggle}
            onMinimize={handleMinimize}
            onNewMessage={handleNewMessage}
            theme={theme}
          />
        </div>
      )}

      {/* Floating Chat Button */}
      <div className={`chat-widget-button ${positionClass} ${theme}`}>
        <button
          className={`chat-button ${hasNewMessage ? 'has-notification' : ''}`}
          onClick={handleToggle}
          title="Chat with CAFM Assistant"
          aria-label="Open chat assistant"
        >
          <FontAwesomeIcon 
            icon={isOpen ? faTimes : faComments} 
            className="chat-icon"
          />
          {hasNewMessage && (
            <span className="notification-badge" aria-label="New message">
              !
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default ChatWidget;
