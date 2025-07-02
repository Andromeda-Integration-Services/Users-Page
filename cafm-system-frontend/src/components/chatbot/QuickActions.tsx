import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicketAlt, 
  faSearch, 
  faQuestionCircle, 
  faTools,
  faLightbulb,
  faPhone,
  faChartLine,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import './QuickActions.css';

interface QuickActionsProps {
  onAction: (action: string) => void;
  theme: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, theme }) => {
  const quickActions = [
    {
      id: 'create-ticket',
      label: 'Create Ticket',
      icon: faTicketAlt,
      action: 'create a ticket',
      color: 'primary',
      description: 'Report an issue or request maintenance'
    },
    {
      id: 'check-status',
      label: 'Check Status',
      icon: faSearch,
      action: 'check ticket status',
      color: 'info',
      description: 'View your existing tickets'
    },
    {
      id: 'get-help',
      label: 'Get Help',
      icon: faQuestionCircle,
      action: 'get help',
      color: 'secondary',
      description: 'Learn how to use the system'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: faPhone,
      action: 'report emergency',
      color: 'danger',
      description: 'Report urgent facility issues'
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: faTools,
      action: 'schedule maintenance',
      color: 'warning',
      description: 'Schedule routine maintenance'
    },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: faLightbulb,
      action: 'make suggestion',
      color: 'success',
      description: 'Suggest facility improvements'
    }
  ];

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-header">
        <h6 className="quick-actions-title">Quick Actions</h6>
        <p className="quick-actions-subtitle">Choose what you'd like to do:</p>
      </div>
      
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={`quick-action-btn ${action.color} ${theme}`}
            onClick={() => onAction(action.action)}
            title={action.description}
          >
            <div className="quick-action-icon">
              <FontAwesomeIcon icon={action.icon} />
            </div>
            <div className="quick-action-label">
              {action.label}
            </div>
          </button>
        ))}
      </div>
      
      <div className="quick-actions-footer">
        <small className="text-muted">
          💡 You can also type your question directly above
        </small>
      </div>
    </div>
  );
};

export default QuickActions;
