import React, { useState, useEffect } from 'react';
import { Modal, Button, Tab, Tabs, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faHistory, 
  faChartLine, 
  faEnvelope,
  faTicketAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faIdCard,
  faUserTag
} from '@fortawesome/free-solid-svg-icons';
import adminUserService, { 
  type AdminUser, 
  type UserLoginHistory, 
  type UserActivity, 
  type UserStatistics 
} from '../../api/adminUserService';

interface UserDetailModalProps {
  show: boolean;
  onHide: () => void;
  user: AdminUser;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ show, onHide, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loginHistory, setLoginHistory] = useState<UserLoginHistory[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && user) {
      fetchUserData();
    }
  }, [show, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [loginHistoryData, activityData, statsData] = await Promise.all([
        adminUserService.getUserLoginHistory(user.id, 1, 10),
        adminUserService.getUserActivity(user.id, 1, 10),
        adminUserService.getUserStatistics(user.id)
      ]);

      setLoginHistory(loginHistoryData);
      setUserActivity(activityData);
      setUserStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faUser} className="me-2" />
          User Details - {user.fullName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')} className="mb-3">
          {/* Overview Tab */}
          <Tab eventKey="overview" title={
            <span>
              <FontAwesomeIcon icon={faUser} className="me-1" />
              Overview
            </span>
          }>
            <div className="row">
              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FontAwesomeIcon icon={faIdCard} className="me-2" />
                      Personal Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Full Name:</strong></td>
                          <td>{user.fullName}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{user.email}</td>
                        </tr>
                        <tr>
                          <td><strong>Employee ID:</strong></td>
                          <td>{user.employeeId}</td>
                        </tr>
                        <tr>
                          <td><strong>Department:</strong></td>
                          <td>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                            {user.department}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>{getStatusBadge(user.isActive)}</td>
                        </tr>
                        <tr>
                          <td><strong>Roles:</strong></td>
                          <td>{getRoleBadges(user.roles)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </div>

              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      Account Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Created:</strong></td>
                          <td>{formatDate(user.createdAt)}</td>
                        </tr>
                        <tr>
                          <td><strong>Last Login:</strong></td>
                          <td>
                            {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Last Activity:</strong></td>
                          <td>
                            {user.lastActivityAt ? formatDate(user.lastActivityAt) : 'No activity'}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Unread Messages:</strong></td>
                          <td>
                            {user.unreadMessages > 0 ? (
                              <Badge bg="warning">{user.unreadMessages}</Badge>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Quick Stats */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FontAwesomeIcon icon={faTicketAlt} className="me-2" />
                  Ticket Summary
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="row text-center">
                  <div className="col-md-3">
                    <h4 className="text-primary">{user.totalTicketsCreated}</h4>
                    <p className="text-muted mb-0">Created</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-warning">{user.totalTicketsAssigned}</h4>
                    <p className="text-muted mb-0">Assigned</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-success">{user.totalTicketsCompleted}</h4>
                    <p className="text-muted mb-0">Completed</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-info">
                      {user.totalTicketsAssigned > 0 
                        ? Math.round((user.totalTicketsCompleted / user.totalTicketsAssigned) * 100)
                        : 0}%
                    </h4>
                    <p className="text-muted mb-0">Completion Rate</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Statistics Tab */}
          <Tab eventKey="statistics" title={
            <span>
              <FontAwesomeIcon icon={faChartLine} className="me-1" />
              Statistics
            </span>
          }>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : userStats ? (
              <div className="row">
                <div className="col-md-6">
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Performance Metrics</h6>
                    </Card.Header>
                    <Card.Body>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Completion Rate:</strong></td>
                            <td>
                              <Badge bg={userStats.completionRate >= 80 ? 'success' : userStats.completionRate >= 60 ? 'warning' : 'danger'}>
                                {userStats.completionRate.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Total Logins:</strong></td>
                            <td>{userStats.totalLogins}</td>
                          </tr>
                          <tr>
                            <td><strong>Account Age:</strong></td>
                            <td>{userStats.accountAge} days</td>
                          </tr>
                          <tr>
                            <td><strong>Total Messages:</strong></td>
                            <td>{userStats.totalMessages}</td>
                          </tr>
                          <tr>
                            <td><strong>Unread Messages:</strong></td>
                            <td>
                              {userStats.unreadMessages > 0 ? (
                                <Badge bg="warning">{userStats.unreadMessages}</Badge>
                              ) : (
                                <span className="text-success">0</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Activity Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Tickets Created:</strong></td>
                            <td>{userStats.ticketsCreated}</td>
                          </tr>
                          <tr>
                            <td><strong>Tickets Assigned:</strong></td>
                            <td>{userStats.ticketsAssigned}</td>
                          </tr>
                          <tr>
                            <td><strong>Tickets Completed:</strong></td>
                            <td>{userStats.ticketsCompleted}</td>
                          </tr>
                          <tr>
                            <td><strong>Last Login:</strong></td>
                            <td>
                              {userStats.lastLogin ? formatDate(userStats.lastLogin) : 'Never'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            ) : (
              <Alert variant="info">No statistics available</Alert>
            )}
          </Tab>

          {/* Login History Tab */}
          <Tab eventKey="login-history" title={
            <span>
              <FontAwesomeIcon icon={faHistory} className="me-1" />
              Login History
            </span>
          }>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.length > 0 ? (
                    loginHistory.map((login) => (
                      <tr key={login.id}>
                        <td>{formatDate(login.loginTime)}</td>
                        <td><code>{login.ipAddress}</code></td>
                        <td>
                          <Badge bg={login.isSuccessful ? 'success' : 'danger'}>
                            {login.isSuccessful ? 'Success' : 'Failed'}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {login.userAgent.substring(0, 50)}...
                          </small>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No login history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Tab>

          {/* Activity Tab */}
          <Tab eventKey="activity" title={
            <span>
              <FontAwesomeIcon icon={faUserTag} className="me-1" />
              Activity
            </span>
          }>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Activity Type</th>
                    <th>Description</th>
                    <th>Related Entity</th>
                  </tr>
                </thead>
                <tbody>
                  {userActivity.length > 0 ? (
                    userActivity.map((activity, index) => (
                      <tr key={index}>
                        <td>{formatDate(activity.timestamp)}</td>
                        <td>
                          <Badge bg="info">{activity.activityType}</Badge>
                        </td>
                        <td>{activity.description}</td>
                        <td>
                          {activity.relatedEntityType && activity.relatedEntityId ? (
                            <small className="text-muted">
                              {activity.relatedEntityType}: {activity.relatedEntityId}
                            </small>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No activity history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
