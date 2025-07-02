import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../components/layout/MainLayout';

const UnauthorizedPage: React.FC = () => {
  return (
    <MainLayout>
      <Container className="py-5 text-center">
        <div className="mb-4">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            size="5x" 
            className="text-warning"
          />
        </div>
        
        <h1 className="mb-4">Access Denied</h1>
        
        <Alert variant="warning" className="mb-4">
          <p className="mb-0">
            You don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
        </Alert>
        
        <div className="d-flex justify-content-center gap-3">
          <Button 
            as={Link} 
            to="/" 
            variant="primary"
          >
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Go to Home
          </Button>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="outline-secondary"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go Back
          </Button>
        </div>
      </Container>
    </MainLayout>
  );
};

export default UnauthorizedPage;
