import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faHome,
  faTicketAlt,
  faPlus,
  faUser,
  faSignOutAlt,
  faCog,
  faUsers,
  faBell,
  faSearch,
  faChevronDown,
  faTachometerAlt,
  faBuilding,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

interface ProfessionalLayoutProps {
  children: React.ReactNode;
}

const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: faTachometerAlt,
      roles: ['Admin', 'Manager', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'Engineer', 'EndUser']
    },
    {
      name: 'Service Requests',
      href: '/tickets',
      icon: faTicketAlt,
      roles: ['Admin', 'Manager', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'Engineer', 'EndUser']
    },
    {
      name: 'Create Request',
      href: '/tickets/new',
      icon: faPlus,
      roles: ['Admin', 'Manager', 'EndUser']
    },
    {
      name: 'Admin Dashboard',
      href: '/admin/dashboard',
      icon: faShieldAlt,
      roles: ['Admin']
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: faUsers,
      roles: ['Admin']
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: faCog,
      roles: ['Admin']
    }
  ];

  const filteredNavigation = navigationItems.filter(item =>
    item.roles.some(role => hasRole(role))
  );

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-large transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-white mr-3" />
            <span className="text-xl font-bold text-white">CAFM System</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isCurrentPath(item.href)
                    ? 'sidebar-gov-item-active'
                    : 'sidebar-gov-item'
                } group`}
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="mr-3 h-5 w-5 flex-shrink-0"
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User info in sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.department}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="nav-gov sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                <FontAwesomeIcon icon={faHome} className="h-4 w-4" />
                <span>/</span>
                <span className="text-gray-900 font-medium">
                  {location.pathname === '/dashboard' ? 'Dashboard' :
                   location.pathname === '/tickets' ? 'Service Requests' :
                   location.pathname === '/tickets/new' ? 'Create Request' :
                   location.pathname.startsWith('/admin') ? 'Administration' :
                   'CAFM System'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input-gov pl-10 pr-4 py-2 w-64"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="text-gray-500 hover:text-gray-700 relative">
                <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-danger-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-sm rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 text-gray-400" />
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalLayout;
