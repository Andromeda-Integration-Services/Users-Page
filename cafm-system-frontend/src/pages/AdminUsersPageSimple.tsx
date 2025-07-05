import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faRefresh,
  faCheckCircle,
  faTimesCircle,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../components/layout/MainLayout';
import adminUserService, { type AdminUser } from '../api/adminUserService';
import { useAuth } from '../context/AuthContext';

const AdminUsersPageSimple: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  // Load all users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user =>
        user.department.toLowerCase().includes(term) ||
        user.employeeId.toLowerCase().includes(term) ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new unpaginated endpoint to get all users (like SSMS)
      const allUsers = await adminUserService.getAllUsersUnpaginated();

      // Validate the response
      if (!Array.isArray(allUsers)) {
        throw new Error('Invalid response format from server');
      }

      setUsers(allUsers);
    } catch (err) {
      console.error('Error loading users:', err);

      // Provide specific error messages based on error type
      let errorMessage = 'Failed to load users';
      if (err instanceof Error) {
        if (err.message.includes('Network')) {
          errorMessage = 'Network error - please check your connection and try again';
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed - please log in again';
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'Access denied - insufficient permissions';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error - please try again later';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadUsers();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'NULL';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const renderStatusBadge = (isActive: boolean) => {
    return (
      <Badge bg={isActive ? 'success' : 'danger'} className="d-flex align-items-center gap-1">
        <FontAwesomeIcon icon={isActive ? faCheckCircle : faTimesCircle} size="sm" />
        {isActive ? '1' : '0'}
      </Badge>
    );
  };

  const renderEmailConfirmedBadge = (emailConfirmed: boolean) => {
    return (
      <Badge bg={emailConfirmed ? 'success' : 'warning'} className="d-flex align-items-center gap-1">
        <FontAwesomeIcon icon={emailConfirmed ? faCheckCircle : faTimesCircle} size="sm" />
        {emailConfirmed ? '1' : '0'}
      </Badge>
    );
  };

  if (loading && users.length === 0) {
    return (
      <MainLayout>
        <Container fluid className="py-4">
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <h4 className="mb-2">Loading Users</h4>
            <p className="text-muted">
              Fetching all users from CAFMSystem database...
              {retryCount > 0 && ` (Retry attempt: ${retryCount})`}
            </p>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-1">
                  <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
                  Users Management
                </h1>
                <p className="text-muted mb-0">
                  All users from CAFMSystem database ({filteredUsers.length} total)
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={loadUsers}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faRefresh} className="me-1" />
                  Refresh
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                    <div>
                      <strong>Error loading users:</strong> {error}
                      {retryCount > 0 && (
                        <small className="d-block text-muted mt-1">
                          Retry attempt: {retryCount}
                        </small>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleRetry}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faRefresh} className="me-1" />
                    Retry
                  </button>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search users by department, employee ID, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-primary text-white">
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Users Database View (SSMS Style)
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>
                          <FontAwesomeIcon icon={faBuilding} className="me-1" />
                          Department
                        </th>
                        <th>Employee ID</th>
                        <th>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          Created At
                        </th>
                        <th>Last Login At</th>
                        <th>Is Active</th>
                        <th>
                          <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                          Email Confirmed
                        </th>
                        <th>
                          <FontAwesomeIcon icon={faPhone} className="me-1" />
                          Phone Number
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4 text-muted">
                            {searchTerm ? 'No users found matching your search criteria' : 'No users found in database'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td className="fw-bold">{index + 1}</td>
                            <td>
                              <span className="fw-medium">{user.department || 'NULL'}</span>
                            </td>
                            <td>
                              <code className="bg-light px-2 py-1 rounded">
                                {user.employeeId || 'NULL'}
                              </code>
                            </td>
                            <td className="font-monospace small">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="font-monospace small">
                              {formatDate(user.lastLoginAt)}
                            </td>
                            <td>
                              {renderStatusBadge(user.isActive)}
                            </td>
                            <td>
                              {renderEmailConfirmedBadge(user.emailConfirmed)}
                            </td>
                            <td className="font-monospace">
                              {user.phoneNumber || 'NULL'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <div className="text-muted small">
              <FontAwesomeIcon icon={faUsers} className="me-1" />
              Showing {filteredUsers.length} of {users.length} users from CAFMSystem database
              {searchTerm && ` (filtered by: "${searchTerm}")`}
            </div>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default AdminUsersPageSimple;
