import React from 'react';
import App from './App';
import WorkingChatButton from './components/WorkingChatButton';

/**
 * AppWithWorkingChatbot - The FINAL working version!
 * This version avoids all the import issues we discovered
 */
const AppWithWorkingChatbot: React.FC = () => {
  return (
    <>
      {/* Your existing App - completely unchanged */}
      <App />
      
      {/* Working chatbot - no import issues! */}
      <WorkingChatButton />
    </>
  );
};

export default AppWithWorkingChatbot;
