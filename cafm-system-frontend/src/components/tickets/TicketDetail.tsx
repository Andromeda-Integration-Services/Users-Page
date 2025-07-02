import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUser,
  faTag,
  faEdit,
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import ticketService, { type Ticket, type UpdateTicketRequest } from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';
import FileAttachments from '../common/FileAttachments';
import TicketProgressBar from './TicketProgressBar';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Form state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [category, setCategory] = useState('');

  // Status options
  const statusOptions = [
    { value: '1', label: 'Open' },
    { value: '2', label: 'In Progress' },
    { value: '3', label: 'Completed' },
    { value: '4', label: 'Closed' },
    { value: '5', label: 'Cancelled' },
  ];

  // Priority options
  const priorityOptions = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Critical' },
  ];

  // Category options (matching backend TicketCategory enum exactly)
  const categoryOptions = [
    { value: '1', label: 'General' },      // TicketCategory.General = 1
    { value: '2', label: 'Plumbing' },     // TicketCategory.Plumbing = 2
    { value: '3', label: 'Electrical' },   // TicketCategory.Electrical = 3
    { value: '4', label: 'HVAC' },         // TicketCategory.HVAC = 4
    { value: '5', label: 'Cleaning' },     // TicketCategory.Cleaning = 5
    { value: '6', label: 'Security' },     // TicketCategory.Security = 6
    { value: '7', label: 'IT' },           // TicketCategory.IT = 7
    { value: '8', label: 'Maintenance' },  // TicketCategory.Maintenance = 8
    { value: '9', label: 'Safety' },       // TicketCategory.Safety = 9
    { value: '10', label: 'Other' },       // TicketCategory.Other = 10
  ];

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }
  }, [id]);

  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      const data = await ticketService.getTicketById(parseInt(ticketId));
      setTicket(data);

      // Initialize form state
      setStatus(data.status.toString());
      setPriority(data.priority.toString());
      setAssignedTo(data.assignedToUserId || '');
      setCategory(data.category.toString());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;

    try {
      const updateData: UpdateTicketRequest = {
        status: parseInt(status),
        priority: parseInt(priority),
        assignedToUserId: assignedTo || undefined,
      };

      const updatedTicket = await ticketService.updateTicket(parseInt(id), updateData);
      setTicket(updatedTicket);
      setIsEditing(false);
      setUpdateSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket');
    }
  };

  // Get status badge variant
  const getStatusBadge = (statusValue: number) => {
    switch (statusValue) {
      case 1: // Open
        return 'primary';
      case 2: // InProgress
        return 'warning';
      case 3: // Completed
        return 'success';
      case 4: // Closed
        return 'secondary';
      case 5: // Cancelled
        return 'danger';
      default:
        return 'info';
    }
  };

  // Get priority badge variant
  const getPriorityBadge = (priorityValue: number) => {
    switch (priorityValue) {
      case 1: // Low
        return 'info';
      case 2: // Medium
        return 'secondary';
      case 3: // High
        return 'warning';
      case 4: // Critical
        return 'danger';
      default:
        return 'light';
    }
  };

  // Check if user can edit the ticket
  const canEditTicket = () => {
    if (!user || !ticket) return false;

    // Admin can edit all tickets
    if (hasRole('Admin')) return true;

    // Asset Manager can edit all tickets
    if (hasRole('AssetManager')) return true;

    // Technicians can edit tickets assigned to them
    if (ticket.assignedToUserId === user.userId &&
        (hasRole('Plumber') || hasRole('Electrician') || hasRole('Cleaner'))) {
      return true;
    }

    // Users can only edit their own tickets if they're still open
    if (ticket.createdByUserId === user.userId && ticket.status === 1) {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        {error}
      </Alert>
    );
  }

  if (!ticket) {
    return (
      <Alert variant="warning">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Ticket not found
      </Alert>
    );
  }

  return (
    <div>
      {/* Success message */}
      {updateSuccess && (
        <Alert variant="success" className="mb-4">
          Ticket updated successfully!
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/tickets')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Tickets
        </Button>

        {canEditTicket() && !isEditing && (
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit Ticket
          </Button>
        )}
      </div>

      <Card className="shadow">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Ticket #{ticket.id}</h4>
            <Badge bg={getStatusBadge(ticket.status)} className="fs-6">
              {ticket.statusText}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Ticket Progress Bar */}
          <TicketProgressBar
            status={ticket.status}
            statusText={ticket.statusText}
            createdAt={ticket.createdAt}
            assignedAt={ticket.assignedAt}
            completedAt={ticket.completedAt}
            closedAt={ticket.closedAt}
          />

          <h3 className="mb-4">{ticket.title}</h3>

          {isEditing ? (
            <Form>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assigned To (User ID)</Form.Label>
                    <Form.Control
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Enter user ID to assign"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <strong>
                      <FontAwesomeIcon icon={faTag} className="me-2 text-primary" />
                      Priority:
                    </strong>
                    <Badge bg={getPriorityBadge(ticket.priority)} className="ms-2">
                      {ticket.priorityText}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <strong>
                      <FontAwesomeIcon icon={faTag} className="me-2 text-primary" />
                      Category:
                    </strong>
                    <span className="ms-2">{ticket.categoryText}</span>
                  </div>
                  <div className="mb-3">
                    <strong>
                      <FontAwesomeIcon icon={faTag} className="me-2 text-primary" />
                      Type:
                    </strong>
                    <Badge bg={ticket.type === 1 ? 'warning' : 'info'} className="ms-2">
                      {ticket.typeText}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                      Location:
                    </strong>
                    <span className="ms-2">{ticket.location}</span>
                  </div>
                  <div className="mb-3">
                    <strong>
                      <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                      Assigned To:
                    </strong>
                    <span className="ms-2">
                      {ticket.assignedToUserName || 'Not assigned'}
                    </span>
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <h5>Description</h5>
                <div className="p-3 bg-light rounded">
                  {ticket.description}
                </div>
              </div>

              {/* File Attachments Section */}
              <div className="mb-4">
                <FileAttachments
                  attachments={ticket.attachments || []}
                  canDelete={canEditTicket()}
                  onFileDeleted={(attachmentId) => {
                    // Refresh ticket data after file deletion
                    if (id) {
                      fetchTicket(id);
                    }
                  }}
                />
              </div>

              <div className="d-flex justify-content-between text-muted">
                <div>
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Created by: {ticket.createdByUserName}
                </div>
                <div>
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TicketDetail;
