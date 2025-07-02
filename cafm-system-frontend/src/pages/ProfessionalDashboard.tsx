import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faPlus,
  faClock,
  faUsers,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faTurnUp
} from '@fortawesome/free-solid-svg-icons';
import ProfessionalLayout from '../components/layout/ProfessionalLayout';
import ProfessionalTicketList from '../components/tickets/ProfessionalTicketList';
import ticketService from '../api/ticketService';
import { useAuth } from '../context/AuthContext';

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  closedTickets: number;
  criticalTickets: number;
  ticketsByCategory: Record<string, number>;
}

interface RecentTicket {
  id: number;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
}

const ProfessionalDashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, ticketsData] = await Promise.all([
        ticketService.getTicketStats(),
        ticketService.getTickets()
      ]);
      
      setStats(statsData);
      setRecentTickets(ticketsData.slice(0, 5)); // Get 5 most recent tickets
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'badge-info';
      case 'in progress':
        return 'badge-warning';
      case 'completed':
        return 'badge-success';
      case 'closed':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-info';
      case 'low':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <ProfessionalLayout>
          <div className="flex items-center justify-center h-96">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-white">Loading dashboard...</span>
          </div>
        </ProfessionalLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <ProfessionalLayout>
          <div className="bg-white/90 border border-red-200 rounded-lg p-4 m-4">
            <div className="flex">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </ProfessionalLayout>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <ProfessionalLayout>
        <div className="space-y-6">
          {/* Colorful Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #10b981, #3b82f6, #ec4899, #ef4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}>
                  Welcome back, {user?.firstName}! 🎨
                </h1>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#6b7280'
                }}>
                  Here's your colorful facility management dashboard with Green, Blue, Pink & Red themes.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link to="/tickets/new" style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #ec4899, #ef4444)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faPlus} />
                  Create Service Request
                </Link>
              </div>
            </div>
          </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-primary-100 text-primary-600">
                <FontAwesomeIcon icon={faTicketAlt} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalTickets || 0}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <FontAwesomeIcon icon={faTurnUp} className="mr-1 h-3 w-3" />
                  +12% from last month
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-warning-100 text-warning-600">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.openTickets || 0}</p>
                <p className="text-xs text-warning-600 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="mr-1 h-3 w-3" />
                  +3 from yesterday
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-success-100 text-success-600">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedTickets || 0}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="mr-1 h-3 w-3" />
                  +8 this week
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-danger-100 text-danger-600">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.criticalTickets || 0}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <FontAwesomeIcon icon={faArrowDown} className="mr-1 h-3 w-3" />
                  -2 from last week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Service Requests</h3>
                  <Link to="/tickets" className="text-sm text-primary-600 hover:text-primary-700">
                    View all
                  </Link>
                </div>
              </div>
              <div className="gov-card-body p-0">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.title}
                            </div>
                            {ticket.assignedTo && (
                              <div className="text-sm text-gray-500">
                                Assigned to: {ticket.assignedTo}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${getStatusBadge(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="gov-card">
              <div className="gov-card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="gov-card-body">
                <div className="space-y-3">
                  <Link to="/tickets/new" className="btn-gov-primary w-full justify-center">
                    <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                    Create New Request
                  </Link>
                  <Link to="/tickets" className="btn-gov-secondary w-full justify-center">
                    <FontAwesomeIcon icon={faTicketAlt} className="mr-2 h-4 w-4" />
                    View All Requests
                  </Link>
                  {hasRole('Admin') && (
                    <>
                      <Link to="/admin/users" className="btn-gov-secondary w-full justify-center">
                        <FontAwesomeIcon icon={faUsers} className="mr-2 h-4 w-4" />
                        Manage Users
                      </Link>
                      <Link to="/admin/dashboard" className="btn-gov-secondary w-full justify-center">
                        <FontAwesomeIcon icon={faChartLine} className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="gov-card">
              <div className="gov-card-header">
                <h3 className="text-lg font-semibold text-gray-900">Requests by Category</h3>
              </div>
              <div className="gov-card-body">
                {stats?.ticketsByCategory && Object.keys(stats.ticketsByCategory).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(stats.ticketsByCategory).map(([category, count]) => {
                      const percentage = stats.totalTickets > 0 ? (count / stats.totalTickets) * 100 : 0;
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">{category}</span>
                            <span className="text-gray-500">{count}</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No category data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </ProfessionalLayout>
    </div>
  );
};

export default ProfessionalDashboard;
