import React, { useState } from 'react';
import { Button, Card, Container, Alert, Row, Col, Form } from 'react-bootstrap';

const AuthTest: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testRegistration = async () => {
    setLoading(true);
    addResult('🔄 Testing Registration...');

    const testUser = {
      email: `testuser${Date.now()}@test.com`,
      password: 'Test123!',
      confirmPassword: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      department: 'General',
      location: 'Main Building',
      role: 'EndUser'
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();

      if (data.success) {
        addResult(`✅ Registration SUCCESS: ${data.message}`);
        addResult(`📧 Test user created: ${testUser.email}`);

        // Now test login with the new user
        setTimeout(() => testLogin(testUser.email, testUser.password), 1000);
      } else {
        addResult(`❌ Registration FAILED: ${data.message}`);
      }
    } catch (error) {
      addResult(`❌ Registration ERROR: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (email?: string, password?: string) => {
    setLoading(true);
    addResult('🔄 Testing Login...');

    const loginData = {
      email: email || 'admin@cafm.com',
      password: password || 'Admin123!'
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        addResult(`✅ Login SUCCESS: ${data.message}`);
        addResult(`🔑 Token received: ${data.token?.substring(0, 50)}...`);
        addResult(`👤 User: ${data.user?.firstName} ${data.user?.lastName}`);
        addResult(`📧 Email: ${data.user?.email}`);
        addResult(`🏢 Department: ${data.user?.department}`);
        addResult(`📍 Location: ${data.user?.location}`);
        addResult(`🎭 Roles: ${data.user?.roles?.join(', ')}`);
      } else {
        addResult(`❌ Login FAILED: ${data.message}`);
      }
    } catch (error) {
      addResult(`❌ Login ERROR: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = () => {
    testLogin('admin@cafm.com', 'Admin123!');
  };

  const testBackendConnection = async () => {
    setLoading(true);
    addResult('🔄 Testing Backend Connection...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/roles');
      const data = await response.json();

      if (response.ok) {
        addResult(`✅ Backend CONNECTION SUCCESS`);
        addResult(`🎭 Available roles: ${data.join(', ')}`);
      } else {
        addResult(`❌ Backend CONNECTION FAILED: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Backend CONNECTION ERROR: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const runFullTest = async () => {
    clearResults();
    addResult('🚀 Starting Full Authentication Test Suite...');

    // Test 1: Backend Connection
    await testBackendConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Admin Login
    await testAdminLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: New User Registration + Login
    await testRegistration();
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h3>🧪 Complete Authentication Test Suite</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={3}>
                  <Button
                    variant="success"
                    onClick={runFullTest}
                    disabled={loading}
                    className="w-100 mb-2"
                  >
                    🚀 Run Full Test
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="info"
                    onClick={testBackendConnection}
                    disabled={loading}
                    className="w-100 mb-2"
                  >
                    🔗 Test Backend
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="warning"
                    onClick={testAdminLogin}
                    disabled={loading}
                    className="w-100 mb-2"
                  >
                    👑 Test Admin Login
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="primary"
                    onClick={testRegistration}
                    disabled={loading}
                    className="w-100 mb-2"
                  >
                    📝 Test Registration
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Button
                    variant="secondary"
                    onClick={clearResults}
                    className="me-2"
                  >
                    🗑️ Clear Results
                  </Button>
                  <Button
                    variant="outline-primary"
                    href="/simple-login"
                  >
                    🚀 Go to Simple Login
                  </Button>
                  <Button
                    variant="outline-success"
                    href="/simple-register"
                    className="ms-2"
                  >
                    📝 Go to Simple Register
                  </Button>
                </Col>
              </Row>

              <Card>
                <Card.Header>
                  <h5>📊 Test Results {loading && '(Running...)'}</h5>
                </Card.Header>
                <Card.Body>
                  {results.length === 0 ? (
                    <Alert variant="info">
                      Click "Run Full Test" to test the complete authentication system
                    </Alert>
                  ) : (
                    <div style={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '5px',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}>
                      {results.map((result, index) => (
                        <div key={index} style={{ marginBottom: '5px' }}>
                          {result}
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthTest;
