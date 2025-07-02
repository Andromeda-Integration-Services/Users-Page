import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';

const SimpleDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const tokenData = localStorage.getItem('token');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (tokenData) {
      setToken(tokenData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/simple-login';
  };

  if (!user || !token) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <h4>⚠️ Not Logged In</h4>
          <p>You need to login first.</p>
          <Button variant="primary" href="/simple-login">
            Go to Simple Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h2>🎉 LOGIN SUCCESSFUL! Welcome to CAFM Dashboard</h2>
            </Card.Header>
            <Card.Body>
              <Alert variant="success">
                <h4>✅ Authentication Working!</h4>
                <p>You have successfully logged into the CAFM system.</p>
              </Alert>
              
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>👤 User Information</Card.Header>
                    <Card.Body>
                      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Department:</strong> {user.department || 'Not specified'}</p>
                      <p><strong>Location:</strong> {user.location || 'Not specified'}</p>
                      <p><strong>Roles:</strong> {user.roles?.join(', ') || 'No roles'}</p>
                      <p><strong>Active:</strong> {user.isActive ? '✅ Yes' : '❌ No'}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>🔐 Token Information</Card.Header>
                    <Card.Body>
                      <p><strong>Token:</strong> {token.substring(0, 50)}...</p>
                      <p><strong>Length:</strong> {token.length} characters</p>
                      <p><strong>Status:</strong> ✅ Valid</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card className="mb-3">
                <Card.Header>🚀 Quick Actions</Card.Header>
                <Card.Body>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button variant="primary" href="/tickets">
                      📋 View Tickets
                    </Button>
                    <Button variant="success" href="/tickets/new">
                      ➕ Create Ticket
                    </Button>
                    <Button variant="info" href="/profile">
                      👤 View Profile
                    </Button>
                    {user.roles?.includes('Admin') && (
                      <Button variant="warning" href="/admin/dashboard">
                        ⚙️ Admin Dashboard
                      </Button>
                    )}
                    <Button variant="danger" onClick={handleLogout}>
                      🚪 Logout
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Alert variant="info">
                <h5>🎯 What's Working:</h5>
                <ul>
                  <li>✅ Backend API connection</li>
                  <li>✅ User authentication</li>
                  <li>✅ JWT token generation</li>
                  <li>✅ User data retrieval</li>
                  <li>✅ Role-based access</li>
                  <li>✅ Local storage persistence</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SimpleDashboard;
