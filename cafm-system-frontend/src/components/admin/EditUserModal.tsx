import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import adminUserService, { type AdminUser, type UpdateUser } from '../../api/adminUserService';

interface EditUserModalProps {
  show: boolean;
  onHide: () => void;
  user: AdminUser;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ show, onHide, user, onUserUpdated }) => {
  const [formData, setFormData] = useState<UpdateUser>({
    firstName: '',
    lastName: '',
    department: '',
    employeeId: '',
    roles: [],
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const departments = ['IT', 'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Maintenance'];
  const roles = ['Admin', 'Manager', 'Engineer', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'EndUser'];

  useEffect(() => {
    if (show && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        employeeId: user.employeeId,
        roles: [...user.roles],
        isActive: user.isActive
      });
      setError(null);
      setValidationErrors({});
    }
  }, [show, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.employeeId.trim()) {
      errors.employeeId = 'Employee ID is required';
    }

    if (formData.roles.length === 0) {
      errors.roles = 'At least one role must be selected';
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
      
      await adminUserService.updateUser(user.id, formData);
      onUserUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setValidationErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faUserEdit} className="me-2" />
          Edit User - {user.fullName}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Alert variant="info" className="mb-3">
            <strong>Note:</strong> Email address cannot be changed. Contact system administrator if email change is required.
          </Alert>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.firstName}
                  placeholder="Enter first name"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.lastName}
                  placeholder="Enter last name"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email (Read-only)</Form.Label>
                <Form.Control
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  Email address cannot be modified
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.employeeId}
                  placeholder="Enter employee ID"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.employeeId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Roles * {validationErrors.roles && <span className="text-danger">({validationErrors.roles})</span>}</Form.Label>
            <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {roles.map(role => (
                <Form.Check
                  key={role}
                  type="checkbox"
                  id={`edit-role-${role}`}
                  label={role}
                  checked={formData.roles.includes(role)}
                  onChange={(e) => handleRoleChange(role, e.target.checked)}
                  className="mb-1"
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="editIsActive"
              name="isActive"
              label="Active User"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted">
              Inactive users cannot log in to the system
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Updating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-1" />
                Update User
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
