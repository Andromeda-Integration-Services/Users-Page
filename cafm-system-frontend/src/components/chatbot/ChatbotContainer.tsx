import React from 'react';
import ChatWidget from './ChatWidget';
import { useChatbot } from './ChatbotProvider';

/**
 * ChatbotContainer - The main integration component
 * This is the ONLY component that needs to be added to your app
 * It's completely isolated and won't affect existing functionality
 */
const ChatbotContainer: React.FC = () => {
  const { config, isVisible } = useChatbot();

  // Don't render anything if not visible or disabled
  if (!isVisible || !config.isEnabled) {
    return null;
  }

  return (
    <ChatWidget
      isEnabled={config.isEnabled}
      position={config.position}
      theme={config.theme}
    />
  );
};

export default ChatbotContainer;
