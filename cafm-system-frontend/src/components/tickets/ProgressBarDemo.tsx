import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import TicketProgressBar from './TicketProgressBar';

const ProgressBarDemo: React.FC = () => {
  const demoTickets = [
    {
      id: 1,
      status: 1,
      statusText: 'Open',
      createdAt: '2024-01-15T10:00:00Z',
      title: 'New Ticket - Just Created'
    },
    {
      id: 2,
      status: 2,
      statusText: 'In Progress',
      createdAt: '2024-01-14T09:00:00Z',
      assignedAt: '2024-01-14T11:00:00Z',
      title: 'Ticket Being Worked On'
    },
    {
      id: 3,
      status: 3,
      statusText: 'On Hold',
      createdAt: '2024-01-13T08:00:00Z',
      assignedAt: '2024-01-13T10:00:00Z',
      title: 'Ticket Temporarily On Hold'
    },
    {
      id: 4,
      status: 4,
      statusText: 'Resolved',
      createdAt: '2024-01-12T07:00:00Z',
      assignedAt: '2024-01-12T09:00:00Z',
      completedAt: '2024-01-15T16:00:00Z',
      title: 'Ticket Work Completed'
    },
    {
      id: 5,
      status: 5,
      statusText: 'Closed',
      createdAt: '2024-01-10T06:00:00Z',
      assignedAt: '2024-01-10T08:00:00Z',
      completedAt: '2024-01-12T15:00:00Z',
      closedAt: '2024-01-13T10:00:00Z',
      title: 'Fully Completed Ticket'
    },
    {
      id: 6,
      status: 6,
      statusText: 'Cancelled',
      createdAt: '2024-01-11T05:00:00Z',
      assignedAt: '2024-01-11T07:00:00Z',
      title: 'Cancelled Ticket'
    }
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🎯 Ticket Progress Bar Demo</h2>
      <p className="text-center text-muted mb-5">
        Showcasing all possible ticket states with professional progress visualization
      </p>
      
      <Row>
        {demoTickets.map((ticket) => (
          <Col key={ticket.id} lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <strong>Ticket #{ticket.id}</strong> - {ticket.title}
                </h6>
              </Card.Header>
              <Card.Body>
                <TicketProgressBar
                  status={ticket.status}
                  statusText={ticket.statusText}
                  createdAt={ticket.createdAt}
                  assignedAt={ticket.assignedAt}
                  completedAt={ticket.completedAt}
                  closedAt={ticket.closedAt}
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="mt-5 p-4 bg-light rounded">
        <h5>🎨 Features Demonstrated:</h5>
        <ul className="mb-0">
          <li><strong>Dynamic Color Progression:</strong> Red → Orange → Yellow → Blue → Green</li>
          <li><strong>Interactive Stage Dots:</strong> Hover effects and animations</li>
          <li><strong>Smart Status Mapping:</strong> Automatic progress calculation</li>
          <li><strong>Timeline Information:</strong> Creation, assignment, completion dates</li>
          <li><strong>Special States:</strong> Cancelled tickets with "rotten" appearance</li>
          <li><strong>Professional Styling:</strong> Gradients, shadows, and smooth transitions</li>
          <li><strong>Theme Sensitive:</strong> Automatic dark mode support</li>
          <li><strong>Responsive Design:</strong> Works on all screen sizes</li>
        </ul>
      </div>
    </Container>
  );
};

export default ProgressBarDemo;
