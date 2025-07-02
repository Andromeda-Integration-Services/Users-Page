import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      {error && (
        <Alert variant="danger" className="border-0 mb-4">
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setError(null);
            await login(values.email, values.password);
            navigate('/dashboard');
          } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            {/* Enhanced Email Field with Floating Label */}
            <div className="floating-label-group">
              <div className="input-icon-group">
                <Field
                  type="email"
                  name="email"
                  className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Email Address
                </label>
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              </div>
              <ErrorMessage name="email" component="div" className="text-danger mt-1 small" />
            </div>

            {/* Enhanced Password Field with Floating Label */}
            <div className="floating-label-group">
              <div className="input-icon-group">
                <Field
                  type="password"
                  name="password"
                  className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Password
                </label>
                <FontAwesomeIcon icon={faLock} className="input-icon" />
              </div>
              <ErrorMessage name="password" component="div" className="text-danger mt-1 small" />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-100 btn-lg mb-4"
              style={{
                background: isSubmitting
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'var(--ig-gradient)',
                border: 'none',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: '16px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-instagram me-2" style={{ width: '18px', height: '18px' }}></div>
                  Signing In...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Sign In to CAFM
                </>
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="text-center">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--ig-primary)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Sign up here
          </Link>
        </p>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <small style={{ color: 'var(--text-muted)' }}>
            Demo accounts: admin@cafm.com / Admin123! or user@cafm.com / User123!
          </small>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
