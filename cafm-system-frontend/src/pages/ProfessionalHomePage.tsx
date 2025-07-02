import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faShieldAlt,
  faUsers,
  faChartLine,
  faCog,
  faTicketAlt,
  faArrowRight,
  faCheckCircle,
  faLock,
  faGlobe,
  faMobile,
  faCloud,
  faHeadset,
  faMoon,
  faSun,
  faStar,
  faAward,
  faRocket,
  faInfinity
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useProfessionalTheme } from '../context/ProfessionalThemeContext';

const ProfessionalHomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useProfessionalTheme();

  const features = [
    {
      icon: faTicketAlt,
      title: 'Service Request Management',
      description: 'Streamlined ticket creation, assignment, and tracking for all facility maintenance needs.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: faUsers,
      title: 'User Management',
      description: 'Comprehensive user roles and permissions for different facility management teams.',
      color: 'bg-success-100 text-success-600'
    },
    {
      icon: faChartLine,
      title: 'Analytics & Reporting',
      description: 'Real-time dashboards and detailed reports for facility performance monitoring.',
      color: 'bg-warning-100 text-warning-600'
    },
    {
      icon: faCog,
      title: 'System Configuration',
      description: 'Flexible system settings and customization options for your organization.',
      color: 'bg-info-100 text-info-600'
    }
  ];

  const benefits = [
    {
      icon: faShieldAlt,
      title: 'Government-Grade Security',
      description: 'Enterprise-level security with role-based access control and audit trails.'
    },
    {
      icon: faGlobe,
      title: 'Web-Based Platform',
      description: 'Access from anywhere with our responsive, browser-based interface.'
    },
    {
      icon: faMobile,
      title: 'Mobile Responsive',
      description: 'Optimized for tablets and mobile devices for field technicians.'
    },
    {
      icon: faCloud,
      title: 'Scalable Architecture',
      description: 'Built to grow with your organization and handle increasing workloads.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Colorful Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 via-secondary-500/30 via-accent-500/30 to-highlight-500/30"></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='45' cy='15' r='2'/%3E%3C/g%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3C/g%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Colorful Navigation */}
      <nav className="relative z-10 bg-gradient-to-r from-primary-500/90 via-secondary-500/90 via-accent-500/90 to-highlight-500/90 backdrop-blur-lg shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-lg mr-3 border-2 border-white/50">
                  <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    CAFM System
                  </span>
                  <div className="text-xs text-white/80 font-medium">
                    Colorful Professional Portal
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="h-5 w-5" />
              </button>

              {user ? (
                <Link to="/dashboard" className="px-6 py-3 bg-white text-primary-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105">
                  <FontAwesomeIcon icon={faRocket} className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="px-6 py-3 bg-white/20 text-white hover:bg-white/30 font-semibold rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-200">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-6 py-3 bg-white text-primary-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200/30 dark:bg-secondary-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-warning-200/30 dark:bg-warning-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Logo with Animation */}
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <FontAwesomeIcon icon={faBuilding} className="h-12 w-12 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 dark:from-white dark:via-primary-300 dark:to-white bg-clip-text text-transparent">
                Computer-Aided
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                Facility Management
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
              Professional facility management solution designed for
              <span className="font-semibold text-primary-600 dark:text-primary-400"> government organizations</span>
            </p>

            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Streamline maintenance requests, track assets, and optimize facility operations
              with our secure, enterprise-grade platform trusted by government agencies worldwide.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700">
                <FontAwesomeIcon icon={faShieldAlt} className="mr-2 h-3 w-3" />
                Government-Grade Security
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-200 border border-success-200 dark:border-success-700">
                <FontAwesomeIcon icon={faAward} className="mr-2 h-3 w-3" />
                Enterprise Ready
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-warning-100 dark:bg-warning-900/50 text-warning-800 dark:text-warning-200 border border-warning-200 dark:border-warning-700">
                <FontAwesomeIcon icon={faStar} className="mr-2 h-3 w-3" />
                24/7 Support
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <FontAwesomeIcon icon={faRocket} className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Access Dashboard
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Get Started
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-400 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300">
                    <FontAwesomeIcon icon={faInfinity} className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Request Demo
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by government agencies worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">GOV</div>
                <div className="text-2xl font-bold text-gray-400">SECURE</div>
                <div className="text-2xl font-bold text-gray-400">CERTIFIED</div>
                <div className="text-2xl font-bold text-gray-400">COMPLIANT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Facility Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your facilities efficiently and professionally.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="gov-card text-center">
                <div className="gov-card-body">
                  <div className={`stats-card-icon ${feature.color} mx-auto mb-4`}>
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our CAFM System?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for government and enterprise organizations with the highest standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="stats-card-icon bg-primary-100 text-primary-600">
                    <FontAwesomeIcon icon={benefit.icon} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Facility Management?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join government organizations worldwide who trust our CAFM system for their facility management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Access Your Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                  Sign In Now
                </Link>
                <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                  Request Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-primary-400 mr-3" />
                <span className="text-xl font-bold">CAFM System</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional facility management solution for government and enterprise organizations.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                <span>Government-Grade Security</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faHeadset} className="h-4 w-4 mr-2" />
                  <span>24/7 Support</span>
                </div>
                <p className="text-sm">
                  Professional support for government organizations
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CAFM System. All rights reserved. Government Secure Portal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalHomePage;
