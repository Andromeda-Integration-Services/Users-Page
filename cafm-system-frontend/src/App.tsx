import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUsersPageSimple from './pages/AdminUsersPageSimple';

import SimpleLogin from './components/debug/SimpleLogin';
import SimpleDashboard from './components/debug/SimpleDashboard';
import SimpleRegister from './components/debug/SimpleRegister';
import AuthTest from './components/debug/AuthTest';
import UserDropdownTest from './components/debug/UserDropdownTest';
import SimpleAutocompleteDemo from './SimpleAutocompleteDemo';
import TestPage from './pages/TestPage';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  console.log('🚀 App component is rendering');

  try {
    return (
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/autocomplete" element={<SimpleAutocompleteDemo />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/simple-register" element={<SimpleRegister />} />
            <Route path="/simple-dashboard" element={<SimpleDashboard />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/user-dropdown-test" element={<UserDropdownTest />} />
            <Route path="/create-ticket-demo" element={<CreateTicketPage />} />
            <Route path="/test" element={<TestPage />} />

            {/* Protected routes with simple role-based routing */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/new" element={<CreateTicketPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPageSimple />} />
              <Route path="/admin/settings" element={<div>Admin Settings Page</div>} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('🚨 Error in App component:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee', minHeight: '100vh' }}>
        <h1>🚨 Application Error</h1>
        <p>There was an error loading the application:</p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
}

export default App;
