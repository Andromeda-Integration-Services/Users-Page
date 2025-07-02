import React from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {
  type ServiceDetectionResult,
  getCategoryInfo,
  formatConfidence,
  getConfidenceLevel
} from '../../utils/serviceDetection';

interface ServiceDetectionBadgeProps {
  detectionResult: ServiceDetectionResult | null;
  isDetecting?: boolean;
  showConfidence?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
}

/**
 * ServiceDetectionBadge Component
 * Displays the detected service category with confidence indicator
 * This is a completely new component that doesn't affect existing functionality
 */
const ServiceDetectionBadge: React.FC<ServiceDetectionBadgeProps> = ({
  detectionResult,
  isDetecting = false,
  showConfidence = true,
  size = 'sm',
  className = ''
}) => {
  // Don't render if no detection result and not detecting
  if (!detectionResult && !isDetecting) {
    return null;
  }

  // Show loading state while detecting
  if (isDetecting) {
    return (
      <Badge 
        bg="secondary" 
        className={`d-inline-flex align-items-center gap-1 ${className}`}
      >
        <FontAwesomeIcon icon={faRobot} className="fa-spin" />
        <span>Analyzing...</span>
      </Badge>
    );
  }

  // Show detection result
  if (detectionResult) {
    const categoryInfo = getCategoryInfo(detectionResult.category);
    const confidenceLevel = getConfidenceLevel(detectionResult.confidence);
    
    const badgeContent = (
      <Badge 
        bg={detectionResult.confidence >= 60 ? 'success' : detectionResult.confidence >= 40 ? 'warning' : 'secondary'}
        className={`d-inline-flex align-items-center gap-1 ${className}`}
        style={{ fontSize: size === 'lg' ? '0.9rem' : '0.75rem' }}
      >
        <FontAwesomeIcon 
          icon={detectionResult.confidence >= 60 ? faCheck : faExclamationTriangle} 
        />
        <span>{categoryInfo.icon}</span>
        <span>{detectionResult.categoryText}</span>
        {showConfidence && (
          <span className="ms-1">
            ({formatConfidence(detectionResult.confidence)})
          </span>
        )}
      </Badge>
    );

    // Wrap with tooltip showing additional information
    const tooltipContent = (
      <div>
        <div><strong>Detected Category:</strong> {detectionResult.categoryText}</div>
        <div><strong>Confidence:</strong> {formatConfidence(detectionResult.confidence)} ({confidenceLevel.level})</div>
        {detectionResult.matchedKeywords.length > 0 && (
          <div><strong>Keywords:</strong> {detectionResult.matchedKeywords.join(', ')}</div>
        )}
        <div className="mt-1 text-muted">
          <FontAwesomeIcon icon={faRobot} className="me-1" />
          AI-powered detection
        </div>
      </div>
    );

    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="service-detection-tooltip">{tooltipContent}</Tooltip>}
      >
        {badgeContent}
      </OverlayTrigger>
    );
  }

  return null;
};

export default ServiceDetectionBadge;
