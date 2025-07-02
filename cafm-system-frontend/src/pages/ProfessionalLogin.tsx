import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faShieldAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const ProfessionalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginOptions = [
    { email: 'admin@cafm.com', password: 'Admin123!', role: 'Administrator', color: 'bg-primary-600' },
    { email: 'user@cafm.com', password: 'User123!', role: 'End User', color: 'bg-success-600' },
    { email: 'manager@cafm.com', password: 'Manager123!', role: 'Asset Manager', color: 'bg-warning-600' },
    { email: 'plumber@cafm.com', password: 'Plumber123!', role: 'Plumber', color: 'bg-info-600' }
  ];

  const handleQuickLogin = (loginEmail: string, loginPassword: string) => {
    setEmail(loginEmail);
    setPassword(loginPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      {/* Colorful Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Colorful Logo and Header */}
        <div className="text-center">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ec4899, #ef4444)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '2rem', color: 'white' }} />
          </div>
          <h2 style={{
            marginTop: '1.5rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #10b981, #3b82f6, #ec4899, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            CAFM System
          </h2>
          <p style={{
            marginTop: '0.5rem',
            fontSize: '1.1rem',
            color: 'white',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            🎨 Colorful Professional Portal
          </p>
          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'white', fontSize: '1rem' }} />
            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              Green • Blue • Pink • Red
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="gov-card">
          <div className="gov-card-body">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-danger-800">
                        Authentication Error
                      </h3>
                      <p className="mt-1 text-sm text-danger-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-gov pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-gov pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gov-primary w-full justify-center"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-4 w-4" />
                      Sign in
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Quick Login (Demo)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {quickLoginOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickLogin(option.email, option.password)}
                    className={`${option.color} text-white text-xs py-2 px-3 rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium`}
                  >
                    {option.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Register here
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Government CAFM System. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure • Reliable • Professional
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLogin;
