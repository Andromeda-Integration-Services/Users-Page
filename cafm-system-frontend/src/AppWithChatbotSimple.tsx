import React from 'react';
import App from './App';
import SimpleChatButton from './components/SimpleChatButton';

/**
 * AppWithChatbotSimple - Safe, minimal chatbot version
 * This version uses a simple chat button with no complex dependencies
 */
const AppWithChatbotSimple: React.FC = () => {
  return (
    <>
      {/* Your existing App component - completely unchanged */}
      <App />

      {/* Simple, safe chatbot */}
      <SimpleChatButton />
    </>
  );
};

export default AppWithChatbotSimple;
