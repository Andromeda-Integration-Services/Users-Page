import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faBuilding,
  faTools,
  faChartLine,
  faRocket,
  faStar,
  faShieldAlt,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../components/layout/MainLayout';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
        <div className="fade-in">
          <Container>
            {/* Hero Section */}
            <Row className="mb-5 py-5">
              <Col lg={6} className="d-flex flex-column justify-content-center">
                <div className="slide-in">
                  <h1 className="display-3 fw-bold mb-4" style={{
                    background: 'var(--ig-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    <FontAwesomeIcon icon={faRocket} className="me-3" style={{ color: 'var(--ig-primary)' }} />
                    CAFM System
                  </h1>
                  <h2 className="h3 mb-4" style={{ color: 'var(--text-primary)' }}>
                    Facility Management Made <span style={{ color: 'var(--ig-primary)' }}>Beautiful</span>
                  </h2>
                  <p className="lead mb-4" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Experience the future of facility management with our Instagram-inspired interface.
                    Streamline maintenance requests, automate ticket routing, and track facility issues
                    with style and efficiency.
                  </p>

                  {/* Feature highlights */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FontAwesomeIcon icon={faBolt} className="me-2" style={{ color: 'var(--ig-yellow)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>Lightning-fast ticket creation</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-2" style={{ color: 'var(--ig-blue)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>Enterprise-grade security</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FontAwesomeIcon icon={faStar} className="me-2" style={{ color: 'var(--ig-accent)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>AI-powered smart routing</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        as={Link}
                        to="/dashboard"
                        variant="primary"
                        size="lg"
                        className="px-4 py-3"
                      >
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        Go to Dashboard
                      </Button>
                      <Button
                        as={Link}
                        to="/tickets/new"
                        variant="outline-primary"
                        size="lg"
                        className="px-4 py-3"
                      >
                        <FontAwesomeIcon icon={faTicketAlt} className="me-2" />
                        Create Ticket
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        as={Link}
                        to="/login"
                        variant="primary"
                        size="lg"
                        className="px-4 py-3"
                      >
                        <FontAwesomeIcon icon={faRocket} className="me-2" />
                        Get Started
                      </Button>
                      <Button
                        as={Link}
                        to="/register"
                        variant="outline-primary"
                        size="lg"
                        className="px-4 py-3"
                      >
                        <FontAwesomeIcon icon={faStar} className="me-2" />
                        Sign Up Free
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={6} className="mt-5 mt-lg-0">
                <div className="text-center">
                  <div
                    className="rounded-4 p-4 shadow-lg"
                    style={{
                      background: 'var(--ig-gradient)',
                      transform: 'rotate(-2deg)',
                      marginBottom: '2rem'
                    }}
                  >
                    <div
                      className="bg-white rounded-3 p-4"
                      style={{ transform: 'rotate(2deg)' }}
                    >
                      <FontAwesomeIcon
                        icon={faBuilding}
                        size="6x"
                        style={{ color: 'var(--ig-primary)' }}
                      />
                      <h3 className="mt-3 mb-0" style={{ color: 'var(--text-primary)' }}>
                        Modern Interface
                      </h3>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Features Section */}
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Why Choose Our Platform?
              </h2>
              <p className="lead" style={{ color: 'var(--text-secondary)' }}>
                Discover the features that make facility management effortless and enjoyable
              </p>
            </div>

            <Row className="g-4 mb-5">
              <Col lg={3} md={6}>
                <Card className="h-100 text-center border-0 feature-card">
                  <Card.Body className="p-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--ig-primary), var(--ig-accent))'
                      }}
                    >
                      <FontAwesomeIcon icon={faTicketAlt} size="2x" style={{ color: 'white' }} />
                    </div>
                    <Card.Title className="h4 mb-3">Smart Tickets</Card.Title>
                    <Card.Text style={{ color: 'var(--text-secondary)' }}>
                      Create, track, and manage maintenance requests with our intuitive interface.
                      Real-time updates keep everyone in the loop.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6}>
                <Card className="h-100 text-center border-0 feature-card">
                  <Card.Body className="p-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--ig-secondary), var(--ig-blue))'
                      }}
                    >
                      <FontAwesomeIcon icon={faTools} size="2x" style={{ color: 'white' }} />
                    </div>
                    <Card.Title className="h4 mb-3">AI Routing</Card.Title>
                    <Card.Text style={{ color: 'var(--text-secondary)' }}>
                      Our AI-powered system automatically routes tickets to the right department
                      based on intelligent keyword detection.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6}>
                <Card className="h-100 text-center border-0 feature-card">
                  <Card.Body className="p-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--ig-blue), var(--ig-yellow))'
                      }}
                    >
                      <FontAwesomeIcon icon={faBuilding} size="2x" style={{ color: 'white' }} />
                    </div>
                    <Card.Title className="h4 mb-3">Facility Insights</Card.Title>
                    <Card.Text style={{ color: 'var(--text-secondary)' }}>
                      Track maintenance patterns and identify recurring issues across your
                      facilities with powerful analytics.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6}>
                <Card className="h-100 text-center border-0 feature-card">
                  <Card.Body className="p-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--ig-accent), var(--ig-primary))'
                      }}
                    >
                      <FontAwesomeIcon icon={faChartLine} size="2x" style={{ color: 'white' }} />
                    </div>
                    <Card.Title className="h4 mb-3">Live Analytics</Card.Title>
                    <Card.Text style={{ color: 'var(--text-secondary)' }}>
                      Comprehensive reporting and real-time analytics help you optimize
                      maintenance operations and reduce costs.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Call to Action Section */}
            <div className="text-center py-5">
              <div
                className="rounded-4 p-5"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h3 className="h2 mb-3" style={{ color: 'var(--text-primary)' }}>
                  Ready to Transform Your Facility Management?
                </h3>
                <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Join thousands of facilities already using our platform to streamline their operations.
                </p>
                {!isAuthenticated && (
                  <div className="d-flex justify-content-center gap-3">
                    <Button
                      as={Link}
                      to="/register"
                      variant="primary"
                      size="lg"
                      className="px-5 py-3"
                    >
                      <FontAwesomeIcon icon={faRocket} className="me-2" />
                      Start Free Trial
                    </Button>
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline-primary"
                      size="lg"
                      className="px-5 py-3"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </MainLayout>
  );
};

export default HomePage;
