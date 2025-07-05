import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash, 
  faToggleOn, 
  faToggleOff,
  faEnvelope,
  faHistory,
  faChartLine,
  faEye,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../components/layout/MainLayout';
import adminUserService, { type AdminUser } from '../api/adminUserService';
import { useAuth } from '../context/AuthContext';
import UserDetailModal from '../components/admin/UserDetailModal';
import CreateUserModal from '../components/admin/CreateUserModal';
import EditUserModal from '../components/admin/EditUserModal';
import SendMessageModal from '../components/admin/SendMessageModal';

const AdminUsersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // Modal states
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Available options for filters
  const departments = ['IT', 'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Maintenance'];
  const roles = ['Admin', 'Manager', 'Engineer', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'EndUser'];

  useEffect(() => {
    if (!hasRole('Admin')) {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [hasRole, pageNumber, searchTerm, selectedDepartment, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from API...');
      const usersData = await adminUserService.getAllUsers(
        pageNumber,
        pageSize,
        searchTerm || undefined,
        selectedDepartment || undefined,
        selectedRole || undefined
      );
      console.log('Received users data:', usersData);
      setUsers(usersData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    fetchUsers();
  };

  const handleUserCreated = () => {
    setShowCreateUser(false);
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setShowEditUser(false);
    fetchUsers();
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await adminUserService.toggleUserStatus(userId);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await adminUserService.deleteUser(userId);
        fetchUsers();
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const openUserDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const openEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const openSendMessage = (user: AdminUser) => {
    setSelectedUser(user);
    setShowSendMessage(true);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge bg={isActive ? 'success' : 'danger'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => (
      <Badge key={role} bg="primary" className="me-1">
        {role}
      </Badge>
    ));
  };

  if (!hasRole('Admin')) {
    return (
      <MainLayout>
        <Alert variant="danger">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Access denied. Admin role required to view this page.
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3">
              <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
              User Management
            </h1>
            <p className="text-muted">Manage system users, roles, and permissions</p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Search & Filter
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row>
                <Col md={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="mb-3"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mb-3"
                  >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button type="submit" variant="primary" className="w-100 mb-3">
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <Row className="mb-3">
          <Col>
            <Button
              variant="success"
              onClick={() => setShowCreateUser(true)}
              className="me-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Create New User
            </Button>
          </Col>
        </Row>

        {/* Users Table */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Users ({users.length})
            </h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Roles</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Tickets</th>
                    <th>Messages</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.fullName}</strong>
                        <br />
                        <small className="text-muted">ID: {user.employeeId}</small>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.department}</td>
                      <td>{getRoleBadges(user.roles)}</td>
                      <td>{getStatusBadge(user.isActive)}</td>
                      <td>
                        {user.lastLoginAt ? (
                          <small>{new Date(user.lastLoginAt).toLocaleDateString()}</small>
                        ) : (
                          <small className="text-muted">Never</small>
                        )}
                      </td>
                      <td>
                        <small>
                          Created: {user.totalTicketsCreated}<br />
                          Assigned: {user.totalTicketsAssigned}<br />
                          Completed: {user.totalTicketsCompleted}
                        </small>
                      </td>
                      <td>
                        {user.unreadMessages > 0 && (
                          <Badge bg="warning">{user.unreadMessages} unread</Badge>
                        )}
                      </td>
                      <td>
                        <div className="btn-group-vertical btn-group-sm">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openUserDetail(user)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditUser(user)}
                            title="Edit User"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => openSendMessage(user)}
                            title="Send Message"
                          >
                            <FontAwesomeIcon icon={faEnvelope} />
                          </Button>
                          <Button
                            variant={user.isActive ? "outline-warning" : "outline-success"}
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            <FontAwesomeIcon icon={user.isActive ? faToggleOff : faToggleOn} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modals */}
        {selectedUser && (
          <>
            <UserDetailModal
              show={showUserDetail}
              onHide={() => setShowUserDetail(false)}
              user={selectedUser}
            />
            <EditUserModal
              show={showEditUser}
              onHide={() => setShowEditUser(false)}
              user={selectedUser}
              onUserUpdated={handleUserUpdated}
            />
            <SendMessageModal
              show={showSendMessage}
              onHide={() => setShowSendMessage(false)}
              user={selectedUser}
              onMessageSent={() => setShowSendMessage(false)}
            />
          </>
        )}

        <CreateUserModal
          show={showCreateUser}
          onHide={() => setShowCreateUser(false)}
          onUserCreated={handleUserCreated}
        />
      </Container>
    </MainLayout>
  );
};

export default AdminUsersPage;
