import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignOutAlt,
  faTicketAlt,
  faTachometerAlt,
  faMoon,
  faSun,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import UserNotificationPanel from '../notifications/UserNotificationPanel';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className="cafm-navbar mb-4"
      style={{
        background: 'var(--ig-gradient)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px var(--shadow-light)',
        minHeight: '64px'
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{
            color: 'white',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '1.5rem',
            textDecoration: 'none'
          }}
        >
          <FontAwesomeIcon
            icon={faBuilding}
            className="me-2"
            style={{ color: 'white' }}
          />
          CAFM System
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white'
          }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="cafm-nav-link"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-1" />
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/tickets"
                  className="cafm-nav-link"
                >
                  <FontAwesomeIcon icon={faTicketAlt} className="me-1" />
                  Tickets
                </Nav.Link>
                {hasRole('Admin') && (
                  <NavDropdown
                    title="Admin"
                    id="admin-dropdown"
                    className="cafm-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Users
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/settings">
                      Settings
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>

              <Nav className="d-flex align-items-center">
                {/* User Notifications */}
                <div className="me-3">
                  <UserNotificationPanel />
                </div>

                {/* Theme Toggle Button */}
                <Nav.Link
                  onClick={toggleTheme}
                  className="cafm-nav-link me-2"
                  style={{ cursor: 'pointer' }}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                  <FontAwesomeIcon
                    icon={theme === 'light' ? faMoon : faSun}
                    className="me-1"
                  />
                  {theme === 'light' ? 'Dark' : 'Light'}
                </Nav.Link>

                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {user?.firstName} {user?.lastName}
                    </span>
                  }
                  id="user-dropdown"
                  className="cafm-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto d-flex align-items-center">
              {/* Theme Toggle for non-authenticated users */}
              <Nav.Link
                onClick={toggleTheme}
                className="cafm-nav-link me-2"
                style={{ cursor: 'pointer' }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <FontAwesomeIcon
                  icon={theme === 'light' ? faMoon : faSun}
                  className="me-1"
                />
                {theme === 'light' ? 'Dark' : 'Light'}
              </Nav.Link>

              <Nav.Link as={Link} to="/login" className="cafm-nav-link">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="cafm-nav-link">
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
