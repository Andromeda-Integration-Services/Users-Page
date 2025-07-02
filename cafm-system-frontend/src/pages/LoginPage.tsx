import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import LoginForm from '../components/auth/LoginForm';
import ThemeToggle from '../components/ui/ThemeToggle';

const LoginPage: React.FC = () => {
  return (
    <>
      <ThemeToggle />
      <div
        className="min-vh-100 d-flex align-items-center"
        style={{
          background: 'var(--bg-primary)',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={7} sm={9}>
              <div className="text-center mb-4 fade-in">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--ig-gradient)'
                  }}
                >
                  <FontAwesomeIcon icon={faRocket} size="2x" style={{ color: 'white' }} />
                </div>
                <h1
                  className="h2 fw-bold mb-2"
                  style={{
                    background: 'var(--ig-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Welcome Back
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Sign in to your CAFM account
                </p>
              </div>

              <Card className="border-0 shadow-lg slide-in">
                <Card.Body className="p-4">
                  <LoginForm />
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="me-2"
                    style={{ color: 'var(--ig-blue)' }}
                  />
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Your data is protected with enterprise-grade security
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoginPage;
