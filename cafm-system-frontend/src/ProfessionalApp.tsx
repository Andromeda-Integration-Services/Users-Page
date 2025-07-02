import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProfessionalThemeProvider } from './context/ProfessionalThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Professional Pages
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProfessionalLogin from './pages/ProfessionalLogin';
import ProfessionalTicketsPage from './pages/ProfessionalTicketsPage';
import ProfessionalCreateTicketPage from './pages/ProfessionalCreateTicketPage';
import ProfessionalHomePage from './pages/ProfessionalHomePage';
import ColorfulTestPage from './pages/ColorfulTestPage';
import AutocompleteDemoPage from './pages/AutocompleteDemoPage';

// Existing Pages (keeping for compatibility)
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

// Debug components (keeping for development)
import SimpleLogin from './components/debug/SimpleLogin';
import SimpleDashboard from './components/debug/SimpleDashboard';
import SimpleRegister from './components/debug/SimpleRegister';
import AuthTest from './components/debug/AuthTest';
import UserDropdownTest from './components/debug/UserDropdownTest';

// Styles - Professional first, then fallback
import './styles/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function ProfessionalApp() {
  return (
    <ProfessionalThemeProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public routes - COLORFUL UI */}
            <Route path="/" element={<ColorfulTestPage />} />
            <Route path="/colorful" element={<ColorfulTestPage />} />
            <Route path="/autocomplete-demo" element={<AutocompleteDemoPage />} />
            <Route path="/login" element={<ProfessionalLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Legacy routes (for comparison) */}
            <Route path="/old-home" element={<HomePage />} />
            <Route path="/professional-home" element={<ProfessionalHomePage />} />
            <Route path="/old-login" element={<LoginPage />} />
            <Route path="/old-dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Debug routes (for development) */}
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/simple-register" element={<SimpleRegister />} />
            <Route path="/simple-dashboard" element={<SimpleDashboard />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/user-dropdown-test" element={<UserDropdownTest />} />

            {/* Protected routes - Using Professional UI with AUTOCOMPLETE */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<ProfessionalDashboard />} />
              <Route path="/tickets" element={<ProfessionalTicketsPage />} />
              <Route path="/tickets/new" element={<ProfessionalCreateTicketPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Legacy routes for comparison */}
            <Route path="/old-tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
            <Route path="/old-create" element={<ProtectedRoute><CreateTicketPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={
                <div className="min-h-screen bg-gray-50 p-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="gov-card">
                      <div className="gov-card-header">
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                      </div>
                      <div className="gov-card-body">
                        <p className="text-gray-600">User management interface coming soon...</p>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/admin/settings" element={
                <div className="min-h-screen bg-gray-50 p-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="gov-card">
                      <div className="gov-card-header">
                        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                      </div>
                      <div className="gov-card-body">
                        <p className="text-gray-600">System settings interface coming soon...</p>
                      </div>
                    </div>
                  </div>
                </div>
              } />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ProfessionalThemeProvider>
  );
}

export default ProfessionalApp;
