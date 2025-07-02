import React, { useState } from 'react';
import { Button, Card, Container, Form, Alert } from 'react-bootstrap';

const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@cafm.com');
  const [password, setPassword] = useState('Admin123!');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setResult('Attempting login...');

    try {
      // Direct fetch call to backend
      const response = await fetch('http://localhost:5167/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setResult('✅ LOGIN SUCCESSFUL! Redirecting to dashboard...');

        // Redirect to simple dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/simple-dashboard';
        }, 2000);
      } else {
        setResult(`❌ Login failed: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ width: '400px' }}>
        <Card.Header>
          <h3 className="text-center">🚀 Simple Login Test</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="success"
              onClick={handleLogin}
              disabled={loading}
              className="w-100 mb-3"
              size="lg"
            >
              {loading ? '🔄 Logging in...' : '🚀 LOGIN NOW'}
            </Button>

            <div className="text-center mb-3">
              <Button variant="link" href="/simple-register">
                Don't have an account? Register here
              </Button>
            </div>

            {result && (
              <Alert variant={result.includes('✅') ? 'success' : 'danger'}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', margin: 0 }}>
                  {result}
                </pre>
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SimpleLogin;
