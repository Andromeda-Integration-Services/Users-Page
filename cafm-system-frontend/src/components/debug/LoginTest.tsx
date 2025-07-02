import React, { useState } from 'react';
import { Button, Card, Container, Form, Alert } from 'react-bootstrap';

const LoginTest: React.FC = () => {
  const [email, setEmail] = useState('admin@cafm.com');
  const [password, setPassword] = useState('Admin123!');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setResult('Testing direct API call...');
    
    try {
      const response = await fetch('http://localhost:5167/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setResult(`Direct API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Direct API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAxiosAPI = async () => {
    setLoading(true);
    setResult('Testing Axios API call...');
    
    try {
      const { default: apiClient } = await import('../../api/axiosConfig');
      const response = await apiClient.post('/auth/login', { email, password });
      setResult(`Axios API Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Axios API Error: ${error.message}\nFull error: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthService = async () => {
    setLoading(true);
    setResult('Testing Auth Service...');
    
    try {
      const { default: authService } = await import('../../api/authService');
      const response = await authService.login({ email, password });
      setResult(`Auth Service Response: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`Auth Service Error: ${error.message}\nFull error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Login Debug Test</h3>
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
            
            <div className="d-flex gap-2 mb-3">
              <Button 
                variant="primary" 
                onClick={testDirectAPI} 
                disabled={loading}
              >
                Test Direct API
              </Button>
              <Button 
                variant="secondary" 
                onClick={testAxiosAPI} 
                disabled={loading}
              >
                Test Axios API
              </Button>
              <Button 
                variant="success" 
                onClick={testAuthService} 
                disabled={loading}
              >
                Test Auth Service
              </Button>
            </div>
            
            {result && (
              <Alert variant="info">
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
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

export default LoginTest;
