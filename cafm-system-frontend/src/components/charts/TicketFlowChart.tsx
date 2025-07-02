import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faUser, 
  faUserCog, 
  faBuilding,
  faClock,
  faRoute
} from '@fortawesome/free-solid-svg-icons';

interface TicketFlowData {
  id: number;
  title: string;
  fromUser: string;
  toUser: string;
  department: string;
  status: string;
  priority: string;
  duration: string;
  timestamp: string;
}

interface TicketFlowChartProps {
  data: TicketFlowData[];
  title?: string;
}

const TicketFlowChart: React.FC<TicketFlowChartProps> = ({ 
  data, 
  title = "Live Ticket Flow" 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'primary';
      case 'in progress': return 'warning';
      case 'completed': return 'success';
      case 'closed': return 'secondary';
      default: return 'light';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'plumbing': return '🔧';
      case 'electrical': return '⚡';
      case 'cleaning': return '🧹';
      case 'hvac': return '❄️';
      default: return '🏢';
    }
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-primary text-white">
        <h6 className="mb-0">
          <FontAwesomeIcon icon={faRoute} className="me-2" />
          {title}
          <Badge bg="light" text="dark" className="ms-2">
            {data.length} Active
          </Badge>
        </h6>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {data.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faRoute} size="2x" className="text-muted mb-2" />
              <p className="text-muted">No active ticket flows</p>
            </div>
          ) : (
            data.map((ticket, index) => (
              <div 
                key={ticket.id} 
                className={`p-3 border-bottom ${index % 2 === 0 ? 'bg-light' : ''}`}
              >
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center mb-2">
                      <Badge bg="secondary" className="me-2">
                        #{ticket.id.toString().padStart(4, '0')}
                      </Badge>
                      <span className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                        {ticket.title}
                      </span>
                      <Badge 
                        bg={getPriorityColor(ticket.priority)} 
                        className="ms-2"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <div className="ticket-flow-path d-flex align-items-center flex-wrap">
                      <div className="d-flex align-items-center me-3 mb-1">
                        <FontAwesomeIcon icon={faUser} className="text-muted me-1" />
                        <small className="text-muted">{ticket.fromUser}</small>
                      </div>
                      
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="text-primary me-3 mb-1" 
                      />
                      
                      <div className="d-flex align-items-center me-3 mb-1">
                        <FontAwesomeIcon icon={faUserCog} className="text-success me-1" />
                        <small className="fw-bold">{ticket.toUser}</small>
                      </div>
                      
                      <div className="d-flex align-items-center me-3 mb-1">
                        <span className="me-1">{getDepartmentIcon(ticket.department)}</span>
                        <small className="text-info">{ticket.department}</small>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="text-end">
                    <div className="mb-1">
                      <Badge bg={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    
                    <div className="d-flex justify-content-end align-items-center">
                      <FontAwesomeIcon icon={faClock} className="text-muted me-1" />
                      <small className="text-muted me-2">{ticket.duration}</small>
                      <small className="text-muted">
                        {new Date(ticket.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TicketFlowChart;
