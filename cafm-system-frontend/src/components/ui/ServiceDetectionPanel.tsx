import React from 'react';
import { Card, Alert, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faLightbulb, 
  faTimes, 
  faCheck,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import {
  type ServiceDetectionResult,
  formatConfidence,
  getConfidenceLevel
} from '../../utils/serviceDetection';
import ServiceDetectionBadge from './ServiceDetectionBadge';

interface ServiceDetectionPanelProps {
  detectionResults: ServiceDetectionResult[];
  isDetecting?: boolean;
  onSelectCategory?: (categoryId: number) => void;
  onDismiss?: () => void;
  selectedCategoryId?: number;
  showDismissButton?: boolean;
  className?: string;
}

/**
 * ServiceDetectionPanel Component
 * Shows detailed service detection results with selection options
 * This is a completely new component that doesn't affect existing functionality
 */
const ServiceDetectionPanel: React.FC<ServiceDetectionPanelProps> = ({
  detectionResults,
  isDetecting = false,
  onSelectCategory,
  onDismiss,
  selectedCategoryId,
  showDismissButton = true,
  className = ''
}) => {
  // Don't render if no results and not detecting
  if (!isDetecting && (!detectionResults || detectionResults.length === 0)) {
    return null;
  }

  // Show loading state
  if (isDetecting) {
    return (
      <Alert variant="info" className={`d-flex align-items-center ${className}`}>
        <FontAwesomeIcon icon={faRobot} className="fa-spin me-2" />
        <span>Analyzing your request to suggest the best service category...</span>
      </Alert>
    );
  }

  // Show detection results
  const bestResult = detectionResults[0]; // Results are sorted by confidence
  const hasMultipleResults = detectionResults.length > 1;

  return (
    <Card className={`border-primary ${className}`} style={{ backgroundColor: '#f8f9fa' }}>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faLightbulb} className="me-2" />
          <span>AI Service Detection</span>
        </div>
        {showDismissButton && onDismiss && (
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={onDismiss}
            className="p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}
      </Card.Header>
      
      <Card.Body className="p-3">
        {/* Best Match */}
        <div className="mb-3">
          <h6 className="mb-2 d-flex align-items-center">
            <FontAwesomeIcon icon={faCheck} className="text-success me-2" />
            Recommended Category
          </h6>
          
          <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-white">
            <div className="d-flex align-items-center">
              <ServiceDetectionBadge 
                detectionResult={bestResult} 
                size="lg" 
                className="me-2"
              />
              <div>
                <div className="fw-bold">{bestResult.categoryText}</div>
                <small className="text-muted">
                  Confidence: {formatConfidence(bestResult.confidence)} 
                  ({getConfidenceLevel(bestResult.confidence).level})
                </small>
              </div>
            </div>
            
            {onSelectCategory && (
              <Button
                variant={selectedCategoryId === bestResult.category ? "success" : "outline-primary"}
                size="sm"
                onClick={() => onSelectCategory(bestResult.category)}
                disabled={selectedCategoryId === bestResult.category}
              >
                {selectedCategoryId === bestResult.category ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                    Selected
                  </>
                ) : (
                  'Select'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Matched Keywords */}
        {bestResult.matchedKeywords.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">Detected keywords:</small>
            <div className="d-flex flex-wrap gap-1">
              {bestResult.matchedKeywords.slice(0, 5).map((keyword, index) => (
                <span key={index} className="badge bg-light text-dark border">
                  {keyword}
                </span>
              ))}
              {bestResult.matchedKeywords.length > 5 && (
                <span className="badge bg-light text-muted border">
                  +{bestResult.matchedKeywords.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Alternative Suggestions */}
        {hasMultipleResults && (
          <div>
            <h6 className="mb-2 d-flex align-items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
              Other Possibilities
            </h6>
            
            <ListGroup variant="flush">
              {detectionResults.slice(1, 4).map((result, index) => (
                <ListGroup.Item 
                  key={index} 
                  className="d-flex align-items-center justify-content-between px-0 py-2"
                >
                  <div className="d-flex align-items-center">
                    <ServiceDetectionBadge 
                      detectionResult={result} 
                      className="me-2"
                    />
                    <small className="text-muted">
                      {formatConfidence(result.confidence)} confidence
                    </small>
                  </div>
                  
                  {onSelectCategory && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onSelectCategory(result.category)}
                      disabled={selectedCategoryId === result.category}
                    >
                      {selectedCategoryId === result.category ? 'Selected' : 'Select'}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-3 pt-2 border-top">
          <small className="text-muted d-flex align-items-center">
            <FontAwesomeIcon icon={faRobot} className="me-1" />
            AI-powered suggestion • You can always change the category manually
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceDetectionPanel;
