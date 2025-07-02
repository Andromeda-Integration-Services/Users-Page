import React from 'react';
import App from './App';
import SuperSimpleChatButton from './SuperSimpleChatButton';

/**
 * TestApp - Testing with super simple chat button
 * Adding the simplest possible chat button
 */
const TestApp: React.FC = () => {
  return (
    <div>
      {/* Your existing App - completely unchanged */}
      <App />

      {/* Super simple chat button */}
      <SuperSimpleChatButton />

      {/* Test indicator */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'green',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999
      }}>
        TEST: Simple Button Added!
      </div>
    </div>
  );
};

export default TestApp;
