import React from 'react';
import ProfessionalApp from './ProfessionalApp';
import WorkingChatButton from './components/WorkingChatButton';
import ProfessionalErrorBoundary from './components/ui/ProfessionalErrorBoundary';

/**
 * ProfessionalAppWithChatbot - Professional Government UI with Chatbot
 * 
 * This is a SAFE wrapper that combines:
 * 1. Professional Government-grade UI using Tailwind CSS
 * 2. Working chatbot functionality
 * 3. Maintains all existing functionality
 * 
 * Features:
 * - Professional color scheme (Navy Blue, Gold, Gray)
 * - Government-grade typography and spacing
 * - Modern card-based layout
 * - Professional sidebar navigation
 * - Advanced statistics dashboard
 * - Responsive design for all devices
 * - Maintains localhost:5173 stability
 */
const ProfessionalAppWithChatbot: React.FC = () => {
  return (
    <ProfessionalErrorBoundary>
      {/* Professional App - Government Grade UI */}
      <ProfessionalApp />

      {/* Working chatbot - no import issues! */}
      <WorkingChatButton />

      {/* Professional UI Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        zIndex: 9998,
        boxShadow: '0 4px 20px -2px rgba(30, 58, 138, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        🏛️ Professional UI Active
      </div>
    </ProfessionalErrorBoundary>
  );
};

export default ProfessionalAppWithChatbot;
