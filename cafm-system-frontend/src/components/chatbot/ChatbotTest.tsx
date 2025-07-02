import React from 'react';
import { Card, Alert, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useChatbot } from './ChatbotProvider';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * ChatbotTest - Debug component to verify chatbot integration
 * This component helps verify that the chatbot is working correctly
 * Can be temporarily added to any page for testing
 */
const ChatbotTest: React.FC = () => {
  const { config, isVisible, updateConfig } = useChatbot();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const toggleChatbot = () => {
    updateConfig({ isEnabled: !config.isEnabled });
  };

  const changeTheme = (theme: 'primary' | 'secondary' | 'success') => {
    updateConfig({ theme });
  };

  const changePosition = () => {
    const newPosition = config.position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    updateConfig({ position: newPosition });
  };

  return (
    <Card className="mt-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faRobot} className="me-2" />
          Chatbot Status & Controls
        </h5>
      </Card.Header>
      <Card.Body>
        {/* Status Information */}
        <div className="mb-4">
          <h6>Current Status</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Badge bg={config.isEnabled ? 'success' : 'danger'}>
              <FontAwesomeIcon icon={config.isEnabled ? faCheckCircle : faExclamationTriangle} className="me-1" />
              {config.isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <Badge bg={isVisible ? 'success' : 'warning'}>
              {isVisible ? 'Visible on this page' : 'Hidden on this page'}
            </Badge>
            <Badge bg={isAuthenticated ? 'success' : 'secondary'}>
              {isAuthenticated ? 'User authenticated' : 'Not authenticated'}
            </Badge>
            <Badge bg="info">Theme: {config.theme}</Badge>
            <Badge bg="info">Position: {config.position}</Badge>
          </div>
        </div>

        {/* Current Page Info */}
        <div className="mb-4">
          <h6>Page Information</h6>
          <p className="mb-2"><strong>Current Path:</strong> {location.pathname}</p>
          <p className="mb-2"><strong>User:</strong> {user?.firstName} {user?.lastName} ({user?.email})</p>
          <p className="mb-2">
            <strong>Page Enabled:</strong> {' '}
            {config.enabledPages.some(page => 
              location.pathname === page || location.pathname.startsWith(page)
            ) ? (
              <span className="text-success">✅ Yes</span>
            ) : (
              <span className="text-warning">⚠️ No</span>
            )}
          </p>
        </div>

        {/* Enabled Pages List */}
        <div className="mb-4">
          <h6>Enabled Pages</h6>
          <div className="d-flex flex-wrap gap-1">
            {config.enabledPages.map((page, index) => (
              <Badge 
                key={index} 
                bg={location.pathname.startsWith(page) ? 'primary' : 'secondary'}
              >
                {page}
              </Badge>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <h6>Test Controls</h6>
          <div className="d-flex flex-wrap gap-2">
            <Button 
              variant={config.isEnabled ? 'danger' : 'success'}
              size="sm"
              onClick={toggleChatbot}
            >
              {config.isEnabled ? 'Disable' : 'Enable'} Chatbot
            </Button>
            
            <Button 
              variant="outline-primary"
              size="sm"
              onClick={changePosition}
            >
              Move to {config.position === 'bottom-right' ? 'Left' : 'Right'}
            </Button>
            
            <Button 
              variant="outline-primary"
              size="sm"
              onClick={() => changeTheme('primary')}
              disabled={config.theme === 'primary'}
            >
              Blue Theme
            </Button>
            
            <Button 
              variant="outline-success"
              size="sm"
              onClick={() => changeTheme('success')}
              disabled={config.theme === 'success'}
            >
              Green Theme
            </Button>
            
            <Button 
              variant="outline-secondary"
              size="sm"
              onClick={() => changeTheme('secondary')}
              disabled={config.theme === 'secondary'}
            >
              Gray Theme
            </Button>
          </div>
        </div>

        {/* Warnings and Tips */}
        {!isAuthenticated && (
          <Alert variant="warning">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Chatbot requires user authentication. Please log in to see the chatbot.
          </Alert>
        )}

        {!isVisible && isAuthenticated && (
          <Alert variant="info">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Chatbot is not visible on this page. Navigate to an enabled page to see it.
          </Alert>
        )}

        {config.isEnabled && isVisible && (
          <Alert variant="success">
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Chatbot should be visible! Look for the floating chat button in the {config.position} corner.
          </Alert>
        )}

        {/* Instructions */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Testing Instructions</h6>
          <ol className="mb-0">
            <li>Ensure you're logged in</li>
            <li>Navigate to an enabled page (like /tickets or /dashboard)</li>
            <li>Look for the floating chat button</li>
            <li>Click the button to open the chat</li>
            <li>Try typing a message or using quick actions</li>
            <li>Test different themes and positions using the controls above</li>
          </ol>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChatbotTest;
