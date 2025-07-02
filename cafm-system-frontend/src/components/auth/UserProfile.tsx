import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faUserTag } from '@fortawesome/free-solid-svg-icons';

// Validation schema for password change
const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Handle password change
  const handlePasswordChange = async (values: any, { resetForm }: any) => {
    try {
      // This would be an API call to change password
      // For now, we'll just simulate success
      setPasswordChangeSuccess(true);
      setPasswordChangeError(null);
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
        setShowPasswordForm(false);
      }, 3000);
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Failed to change password');
      setPasswordChangeSuccess(false);
    }
  };

  if (!user) {
    return (
      <Alert variant="warning">
        You must be logged in to view your profile.
      </Alert>
    );
  }

  return (
    <div>
      <Card className="shadow mb-4">
        <Card.Header className="bg-light">
          <h4 className="mb-0">User Profile</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div 
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '150px', height: '150px', fontSize: '4rem' }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h4>{user.firstName} {user.lastName}</h4>
              <div className="mt-3">
                {user.roles.map((role, index) => (
                  <Badge 
                    key={index} 
                    bg="primary" 
                    className="me-1 mb-1"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </Col>
            <Col md={8}>
              <div className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                  Personal Information
                </h5>
                <hr />
                <Row className="mb-2">
                  <Col sm={4} className="fw-bold">First Name:</Col>
                  <Col sm={8}>{user.firstName}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4} className="fw-bold">Last Name:</Col>
                  <Col sm={8}>{user.lastName}</Col>
                </Row>
              </div>
              
              <div className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                  Contact Information
                </h5>
                <hr />
                <Row className="mb-2">
                  <Col sm={4} className="fw-bold">Email:</Col>
                  <Col sm={8}>{user.email}</Col>
                </Row>
              </div>
              
              <div className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faIdCard} className="me-2 text-primary" />
                  Account Information
                </h5>
                <hr />
                <Row className="mb-2">
                  <Col sm={4} className="fw-bold">User ID:</Col>
                  <Col sm={8}>{user.userId}</Col>
                </Row>
              </div>
              
              <div className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faUserTag} className="me-2 text-primary" />
                  Roles & Permissions
                </h5>
                <hr />
                <Row className="mb-2">
                  <Col sm={4} className="fw-bold">Roles:</Col>
                  <Col sm={8}>
                    {user.roles.join(', ')}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {showPasswordForm && (
        <Card className="shadow">
          <Card.Header className="bg-light">
            <h4 className="mb-0">Change Password</h4>
          </Card.Header>
          <Card.Body>
            {passwordChangeSuccess && (
              <Alert variant="success">
                Password changed successfully!
              </Alert>
            )}
            
            {passwordChangeError && (
              <Alert variant="danger">
                {passwordChangeError}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={PasswordChangeSchema}
              onSubmit={handlePasswordChange}
            >
              {({ handleSubmit, isSubmitting, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Field
                      type="password"
                      name="currentPassword"
                      className={`form-control ${touched.currentPassword && errors.currentPassword ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="currentPassword" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Field
                      type="password"
                      name="newPassword"
                      className={`form-control ${touched.newPassword && errors.newPassword ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="newPassword" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="secondary" 
                      className="me-2"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
