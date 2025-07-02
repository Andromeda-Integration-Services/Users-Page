import React from 'react';
import App from './App';
import { ChatbotProvider, ChatbotContainer } from './components/chatbot/index';

/**
 * AppWithChatbot - Enhanced App with Chatbot
 *
 * This is a SAFE wrapper around your existing App component.
 * It adds the chatbot functionality WITHOUT modifying any existing code.
 *
 * To enable: Change your main.tsx to import this instead of App
 * To disable: Simply revert back to importing App
 *
 * ZERO RISK - Your existing app remains completely untouched!
 */
const AppWithChatbot: React.FC = () => {
  // Chatbot configuration - easily customizable
  const chatbotConfig = {
    isEnabled: true,
    position: 'bottom-right' as const,
    theme: 'primary' as const,
    enabledPages: [
      '/',
      '/dashboard',
      '/tickets',
      '/tickets/new',
      '/tickets/',
      '/profile',
      '/admin/dashboard'
    ],
    autoOpen: false
  };

  return (
    <ChatbotProvider config={chatbotConfig}>
      {/* Your existing App component - completely unchanged */}
      <App />

      {/* Chatbot overlay - completely isolated */}
      <ChatbotContainer />
    </ChatbotProvider>
  );
};

export default AppWithChatbot;
