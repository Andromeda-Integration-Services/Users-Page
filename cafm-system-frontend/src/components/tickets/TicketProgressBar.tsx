import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './TicketProgressBar.css';

interface TicketProgressBarProps {
  status: number;
  statusText: string;
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  closedAt?: string;
}

const TicketProgressBar: React.FC<TicketProgressBarProps> = ({
  status,
  statusText,
  createdAt,
  assignedAt,
  completedAt,
  closedAt
}) => {
  // Define the progress stages
  const stages = [
    { id: 1, label: 'Open', value: 'open' },
    { id: 2, label: 'In Progress', value: 'in-progress' },
    { id: 3, label: 'On Hold', value: 'on-hold' },
    { id: 4, label: 'Resolved', value: 'resolved' },
    { id: 5, label: 'Closed', value: 'closed' }
  ];

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

  // Get stage status for styling
  const getStageStatus = (stageId: number, currentStatus: number): 'completed' | 'current' | 'pending' | 'cancelled' => {
    if (currentStatus === 6) return 'cancelled'; // Cancelled status
    
    if (stageId < currentStatus) return 'completed';
    if (stageId === currentStatus) return 'current';
    return 'pending';
  };

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate duration
  const calculateDuration = (): string => {
    const startDate = new Date(createdAt);
    const endDate = closedAt ? new Date(closedAt) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s)`;
    return `${Math.floor(diffDays / 30)} month(s)`;
  };

  const progressPercentage = getProgressPercentage(status);
  const progressVariant = getProgressVariant(status);
  const isCancelled = status === 6;

  return (
    <div className={`ticket-progress-container ${isCancelled ? 'cancelled' : ''}`}>
      <div className="progress-header mb-3">
        <h6 className="mb-2">
          <span className="text-muted">🎯 Ticket Progress:</span>
          <span className={`ms-2 fw-bold ${isCancelled ? 'text-danger' : 'text-primary'}`}>
            {statusText.toUpperCase()}
          </span>
          <span className="ms-2 text-muted">
            ({progressPercentage}% Complete)
          </span>
        </h6>
        
        {/* Enhanced Progress Bar with Professional Gradient */}
        <div className="custom-progress-wrapper">
          <ProgressBar
            now={progressPercentage}
            variant={progressVariant}
            className={`custom-progress-bar ${isCancelled ? 'cancelled-bar' : ''}`}
            animated={!isCancelled && progressPercentage > 0 && progressPercentage < 100}
            striped={!isCancelled}
          />
          
          {/* Progress Stages */}
          <div className="progress-stages">
            {stages.map((stage, index) => {
              const stageStatus = getStageStatus(stage.id, status);
              return (
                <div
                  key={stage.id}
                  className={`progress-stage ${stageStatus}`}
                  style={{ left: `${(index * 25)}%` }}
                  title={`${stage.label}${stageStatus === 'completed' ? ' ✓' : ''}`}
                >
                  <div className="stage-dot"></div>
                  <div className="stage-label">{stage.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Timeline Information */}
      <div className="progress-timeline">
        <div className="timeline-item">
          <small>
            <strong>📅 Created:</strong> {formatDate(createdAt)}
          </small>
        </div>
        {assignedAt && (
          <div className="timeline-item">
            <small>
              <strong>👤 Assigned:</strong> {formatDate(assignedAt)}
            </small>
          </div>
        )}
        {completedAt && (
          <div className="timeline-item">
            <small>
              <strong>✅ Completed:</strong> {formatDate(completedAt)}
            </small>
          </div>
        )}
        {closedAt && (
          <div className="timeline-item">
            <small>
              <strong>🔒 Closed:</strong> {formatDate(closedAt)}
            </small>
          </div>
        )}
        {isCancelled && (
          <div className="timeline-item">
            <small className="text-danger">
              <strong>❌ Status:</strong> This ticket has been cancelled
            </small>
          </div>
        )}
        {!isCancelled && (
          <div className="timeline-item">
            <small>
              <strong>⏱️ Duration:</strong> {calculateDuration()}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketProgressBar;
