import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './TicketProgressBarCompact.css';

interface TicketProgressBarCompactProps {
  status: number;
  statusText: string;
  size?: 'sm' | 'xs';
  showLabel?: boolean;
}

const TicketProgressBarCompact: React.FC<TicketProgressBarCompactProps> = ({
  status,
  statusText,
  size = 'sm',
  showLabel = true
}) => {
  // Calculate progress percentage based on status
  const getProgressPercentage = (currentStatus: number): number => {
    switch (currentStatus) {
      case 1: // Open
        return 20;
      case 2: // In Progress
        return 40;
      case 3: // On Hold / Resolved
        return 60;
      case 4: // Completed/Resolved
        return 80;
      case 5: // Closed
        return 100;
      case 6: // Cancelled
        return 0; // Special case for cancelled
      default:
        return 20;
    }
  };

  // Get progress bar variant based on status
  const getProgressVariant = (currentStatus: number): string => {
    if (currentStatus === 6) return 'danger'; // Cancelled - rotten
    
    const percentage = getProgressPercentage(currentStatus);
    if (percentage <= 20) return 'danger';
    if (percentage <= 40) return 'warning';
    if (percentage <= 60) return 'info';
    if (percentage <= 80) return 'primary';
    return 'success';
  };

  // Get status color for label
  const getStatusColor = (currentStatus: number): string => {
    if (currentStatus === 6) return 'text-danger'; // Cancelled
    
    const percentage = getProgressPercentage(currentStatus);
    if (percentage <= 20) return 'text-danger';
    if (percentage <= 40) return 'text-warning';
    if (percentage <= 60) return 'text-info';
    if (percentage <= 80) return 'text-primary';
    return 'text-success';
  };

  const progressPercentage = getProgressPercentage(status);
  const progressVariant = getProgressVariant(status);
  const statusColor = getStatusColor(status);
  const isCancelled = status === 6;

  return (
    <div className={`ticket-progress-compact ${size} ${isCancelled ? 'cancelled' : ''}`}>
      {showLabel && (
        <div className={`progress-label ${statusColor}`}>
          <small className="fw-bold">{statusText}</small>
        </div>
      )}
      
      <div className="progress-wrapper">
        <ProgressBar 
          now={progressPercentage} 
          variant={progressVariant}
          className={`compact-progress-bar ${isCancelled ? 'cancelled-bar' : ''}`}
        />
        
        {/* Progress indicators */}
        <div className="progress-indicators">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div
              key={stage}
              className={`progress-dot ${stage <= status && status !== 6 ? 'active' : ''} ${status === 6 ? 'cancelled' : ''}`}
              style={{ left: `${(stage - 1) * 25}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketProgressBarCompact;
