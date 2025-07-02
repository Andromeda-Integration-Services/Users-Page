import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Container, Form as BootstrapForm } from 'react-bootstrap';

// Validation schema
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  department: Yup.string()
    .required('Department is required'),
  employeeId: Yup.string()
    .required('Employee ID is required'),
});

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ width: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register for CAFM System</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              department: '',
              employeeId: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                setError(null);
                setSuccess(null);

                await register(
                  values.email,
                  values.password,
                  values.firstName,
                  values.lastName,
                  values.department,
                  values.employeeId
                );

                setSuccess('Registration successful! Redirecting to dashboard...');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } catch (err: any) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>First Name</BootstrapForm.Label>
                      <Field
                        type="text"
                        name="firstName"
                        className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="Enter your first name"
                      />
                      <ErrorMessage name="firstName" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                  </div>
                  <div className="col-md-6">
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Last Name</BootstrapForm.Label>
                      <Field
                        type="text"
                        name="lastName"
                        className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Enter your last name"
                      />
                      <ErrorMessage name="lastName" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                  </div>
                </div>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Email</BootstrapForm.Label>
                  <Field
                    type="email"
                    name="email"
                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <div className="row">
                  <div className="col-md-6">
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Department</BootstrapForm.Label>
                      <Field
                        as="select"
                        name="department"
                        className={`form-select ${touched.department && errors.department ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Department</option>
                        <option value="Administration">Administration (Admin Role)</option>
                        <option value="Facilities">Facilities (Manager Role)</option>
                        <option value="Maintenance">Maintenance (Engineer Role)</option>
                        <option value="Plumbing">Plumbing (Plumber Role)</option>
                        <option value="Electrical">Electrical (Electrician Role)</option>
                        <option value="HVAC">HVAC (HVAC Technician Role)</option>
                        <option value="IT">IT (IT Support Role)</option>
                        <option value="Security">Security (Security Personnel Role)</option>
                        <option value="Cleaning">Cleaning (Cleaner Role)</option>
                        <option value="General">General (End User Role)</option>
                        <option value="Finance">Finance (End User Role)</option>
                        <option value="HR">HR (End User Role)</option>
                      </Field>
                      <ErrorMessage name="department" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                  </div>
                  <div className="col-md-6">
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Employee ID</BootstrapForm.Label>
                      <Field
                        type="text"
                        name="employeeId"
                        className={`form-control ${touched.employeeId && errors.employeeId ? 'is-invalid' : ''}`}
                        placeholder="Enter employee ID"
                      />
                      <ErrorMessage name="employeeId" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                  </div>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100 mt-3"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="text-center mt-3">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;
