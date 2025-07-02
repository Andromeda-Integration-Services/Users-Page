import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import adminUserService, { type AdminUser, type CreateMessage } from '../../api/adminUserService';

interface SendMessageModalProps {
  show: boolean;
  onHide: () => void;
  user: AdminUser;
  onMessageSent: () => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ show, onHide, user, onMessageSent }) => {
  const [formData, setFormData] = useState<CreateMessage>({
    toUserId: '',
    subject: '',
    message: '',
    messageType: 'General'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const messageTypes = [
    { value: 'General', label: 'General Message', color: 'primary' },
    { value: 'Task', label: 'Task Assignment', color: 'warning' },
    { value: 'Alert', label: 'Alert/Warning', color: 'danger' },
    { value: 'Announcement', label: 'Announcement', color: 'info' }
  ];

  React.useEffect(() => {
    if (show && user) {
      setFormData(prev => ({
        ...prev,
        toUserId: user.id
      }));
      setError(null);
      setSuccess(null);
      setValidationErrors({});
    }
  }, [show, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      errors.subject = 'Subject must be 200 characters or less';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length > 2000) {
      errors.message = 'Message must be 2000 characters or less';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await adminUserService.sendMessage(formData);
      
      setSuccess('Message sent successfully!');
      
      // Reset form
      setFormData({
        toUserId: user.id,
        subject: '',
        message: '',
        messageType: 'General'
      });
      
      // Close modal after a short delay
      setTimeout(() => {
        onMessageSent();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      toUserId: user.id,
      subject: '',
      message: '',
      messageType: 'General'
    });
    setError(null);
    setSuccess(null);
    setValidationErrors({});
    onHide();
  };

  const getMessageTypeBadge = (type: string) => {
    const messageType = messageTypes.find(mt => mt.value === type);
    return messageType ? (
      <Badge bg={messageType.color}>{messageType.label}</Badge>
    ) : (
      <Badge bg="secondary">{type}</Badge>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          Send Message to {user.fullName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              {success}
            </Alert>
          )}

          {/* Recipient Info */}
          <Alert variant="info" className="mb-3">
            <strong>Recipient:</strong> {user.fullName} ({user.email})<br />
            <strong>Department:</strong> {user.department}<br />
            <strong>Roles:</strong> {user.roles.map(role => (
              <Badge key={role} bg="primary" className="me-1">{role}</Badge>
            ))}
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>Message Type</Form.Label>
            <Form.Select
              name="messageType"
              value={formData.messageType}
              onChange={handleInputChange}
            >
              {messageTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Current selection: {getMessageTypeBadge(formData.messageType)}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject *</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.subject}
              placeholder="Enter message subject"
              maxLength={200}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.subject}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.subject.length}/200 characters
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.message}
              placeholder="Enter your message here..."
              maxLength={2000}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.message.length}/2000 characters
            </Form.Text>
          </Form.Group>

          {/* Message Type Descriptions */}
          <div className="border rounded p-3 bg-light">
            <h6 className="mb-2">Message Type Descriptions:</h6>
            <ul className="mb-0 small">
              <li><strong>General Message:</strong> Regular communication or information</li>
              <li><strong>Task Assignment:</strong> Assign specific tasks or responsibilities</li>
              <li><strong>Alert/Warning:</strong> Important notifications requiring immediate attention</li>
              <li><strong>Announcement:</strong> System-wide or department announcements</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading || !!success}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Sending...
              </>
            ) : success ? (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
                Sent!
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
                Send Message
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SendMessageModal;
