import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faTicketAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faSync
} from '@fortawesome/free-solid-svg-icons';

interface LiveMetrics {
  activeUsers: number;
  ticketsCreatedToday: number;
  ticketsCompletedToday: number;
  avgResponseTime: number;
  systemLoad: number;
  criticalTickets: number;
  pendingAssignments: number;
  completionRate: number;
}

interface LiveMetricsWidgetProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const LiveMetricsWidget: React.FC<LiveMetricsWidgetProps> = ({
  autoRefresh = true,
  refreshInterval = 30
}) => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeUsers: 0,
    ticketsCreatedToday: 0,
    ticketsCompletedToday: 0,
    avgResponseTime: 0,
    systemLoad: 0,
    criticalTickets: 0,
    pendingAssignments: 0,
    completionRate: 0
  });
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const generateMockMetrics = (): LiveMetrics => ({
    activeUsers: Math.floor(Math.random() * 25) + 5,
    ticketsCreatedToday: Math.floor(Math.random() * 20) + 3,
    ticketsCompletedToday: Math.floor(Math.random() * 15) + 2,
    avgResponseTime: Math.floor(Math.random() * 120) + 30,
    systemLoad: Math.floor(Math.random() * 40) + 20,
    criticalTickets: Math.floor(Math.random() * 5) + 1,
    pendingAssignments: Math.floor(Math.random() * 8) + 2,
    completionRate: Math.floor(Math.random() * 30) + 70
  });

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchMetrics, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getSystemLoadVariant = (load: number) => {
    if (load > 80) return 'danger';
    if (load > 60) return 'warning';
    return 'success';
  };

  const getCompletionRateVariant = (rate: number) => {
    if (rate > 85) return 'success';
    if (rate > 70) return 'warning';
    return 'danger';
  };

  return (
    <Card className="live-metrics-widget border-0 shadow-sm">
      <Card.Header className="bg-gradient-primary text-white border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
            Live System Metrics
          </h6>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon 
              icon={faSync} 
              className={`me-2 ${isLoading ? 'fa-spin' : ''}`} 
            />
            <small>
              {lastUpdated.toLocaleTimeString()}
            </small>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-3">
        <Row className="g-3">
          {/* Active Users */}
          <Col md={3} sm={6}>
            <div className="metric-item text-center p-2 rounded bg-light">
              <FontAwesomeIcon 
                icon={faUsers} 
                size="2x" 
                className="text-primary mb-2" 
              />
              <h4 className="mb-1 text-primary">{metrics.activeUsers}</h4>
              <small className="text-muted">Active Users</small>
            </div>
          </Col>

          {/* Tickets Created Today */}
          <Col md={3} sm={6}>
            <div className="metric-item text-center p-2 rounded bg-light">
              <FontAwesomeIcon 
                icon={faTicketAlt} 
                size="2x" 
                className="text-info mb-2" 
              />
              <h4 className="mb-1 text-info">{metrics.ticketsCreatedToday}</h4>
              <small className="text-muted">Created Today</small>
            </div>
          </Col>

          {/* Tickets Completed Today */}
          <Col md={3} sm={6}>
            <div className="metric-item text-center p-2 rounded bg-light">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                size="2x" 
                className="text-success mb-2" 
              />
              <h4 className="mb-1 text-success">{metrics.ticketsCompletedToday}</h4>
              <small className="text-muted">Completed Today</small>
            </div>
          </Col>

          {/* Critical Tickets */}
          <Col md={3} sm={6}>
            <div className="metric-item text-center p-2 rounded bg-light">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                size="2x" 
                className="text-danger mb-2" 
              />
              <h4 className="mb-1 text-danger">{metrics.criticalTickets}</h4>
              <small className="text-muted">Critical Tickets</small>
            </div>
          </Col>
        </Row>

        <hr className="my-3" />

        {/* Progress Bars */}
        <Row className="g-3">
          <Col md={6}>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-1" />
                  System Load
                </small>
                <Badge bg={getSystemLoadVariant(metrics.systemLoad)}>
                  {metrics.systemLoad}%
                </Badge>
              </div>
              <ProgressBar 
                now={metrics.systemLoad} 
                variant={getSystemLoadVariant(metrics.systemLoad)}
                style={{ height: '8px' }}
              />
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                  Completion Rate
                </small>
                <Badge bg={getCompletionRateVariant(metrics.completionRate)}>
                  {metrics.completionRate}%
                </Badge>
              </div>
              <ProgressBar 
                now={metrics.completionRate} 
                variant={getCompletionRateVariant(metrics.completionRate)}
                style={{ height: '8px' }}
              />
            </div>
          </Col>
        </Row>

        {/* Additional Metrics */}
        <Row className="g-2 mt-2">
          <Col md={4}>
            <div className="text-center">
              <FontAwesomeIcon icon={faClock} className="text-warning me-1" />
              <small className="text-muted">Avg Response: </small>
              <strong>{metrics.avgResponseTime}m</strong>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <FontAwesomeIcon icon={faTicketAlt} className="text-info me-1" />
              <small className="text-muted">Pending: </small>
              <strong>{metrics.pendingAssignments}</strong>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <div className="live-indicator">
                <Badge bg="success">
                  <FontAwesomeIcon icon={faSync} className="me-1" />
                  LIVE
                </Badge>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default LiveMetricsWidget;
