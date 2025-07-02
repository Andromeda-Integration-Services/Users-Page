import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Form, Table, Badge, Alert, ProgressBar, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faFilter,
  faDownload,
  faTicketAlt,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faHistory,
  faUsers,
  faClock,
  faBuilding,
  faArrowRight,
  faSync,
  faEye,
  faCalendarAlt,
  faTachometerAlt,
  faChartLine,
  faUserCog,
  faRoute
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import MainLayout from '../components/layout/MainLayout';
import ticketService, {
  type Ticket,
  type TicketFilterOptions,
  type DepartmentStats,
  type LiveMetrics,
  type TicketHistoryEntry
} from '../api/ticketService';
import { useAuth } from '../context/AuthContext';
import TicketFlowChart from '../components/charts/TicketFlowChart';
import LiveMetricsWidget from '../components/charts/LiveMetricsWidget';
import '../styles/AdminDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  closedTickets: number;
  criticalTickets: number;
  ticketsByCategory: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketTrends: Array<{
    date: string;
    created: number;
    completed: number;
    inProgress: number;
  }>;
}



const AdminDashboardPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilterOptions>({
    pageNumber: 1,
    pageSize: 20,
  });

  // Enhanced state for live dashboard
  const [ticketHistory, setTicketHistory] = useState<TicketHistoryEntry[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    if (!hasRole('Admin')) {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }

    fetchData();
  }, [hasRole, filters]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, ticketsData] = await Promise.all([
        ticketService.getTicketStats(),
        ticketService.getTickets(filters)
      ]);

      setStats(statsData);
      setTickets(ticketsData.tickets);
      setLastUpdated(new Date());

      // Fetch enhanced data
      await fetchEnhancedData();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchEnhancedData = async () => {
    try {
      // Fetch real data from backend APIs
      const [historyData, departmentData, liveMetricsData] = await Promise.all([
        ticketService.getActivityHistory(15),
        ticketService.getDepartmentStats(),
        ticketService.getLiveMetrics()
      ]);

      setTicketHistory(historyData);
      setDepartmentStats(departmentData);
      setLiveMetrics(liveMetricsData);
    } catch (err) {
      console.error('Failed to fetch enhanced data:', err);
      // Fallback to empty data instead of mock data
      setTicketHistory([]);
      setDepartmentStats([]);
      setLiveMetrics(null);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      pageNumber: 1 // Reset to first page when filtering
    }));
  };



  if (!hasRole('Admin')) {
    return (
      <MainLayout>
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Access denied. Admin role required to view this page.
        </Alert>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </Alert>
      </MainLayout>
    );
  }

  // Chart data preparation
  const statusChartData = {
    labels: Object.keys(stats?.ticketsByStatus || {}),
    datasets: [
      {
        data: Object.values(stats?.ticketsByStatus || {}),
        backgroundColor: [
          '#007bff', // Open - Blue
          '#ffc107', // InProgress - Yellow
          '#28a745', // Completed - Green
          '#6c757d', // Closed - Gray
          '#dc3545', // Cancelled - Red
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(stats?.ticketsByCategory || {}),
    datasets: [
      {
        label: 'Tickets by Category',
        data: Object.values(stats?.ticketsByCategory || {}),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const priorityChartData = {
    labels: Object.keys(stats?.ticketsByPriority || {}),
    datasets: [
      {
        label: 'Tickets by Priority',
        data: Object.values(stats?.ticketsByPriority || {}),
        backgroundColor: [
          '#28a745', // Low - Green
          '#ffc107', // Medium - Yellow
          '#fd7e14', // High - Orange
          '#dc3545', // Critical - Red
        ],
        borderWidth: 1,
      },
    ],
  };

  const trendChartData = {
    labels: stats?.ticketTrends.map(t => new Date(t.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Created',
        data: stats?.ticketTrends.map(t => t.created) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Completed',
        data: stats?.ticketTrends.map(t => t.completed) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <MainLayout>
      {/* Enhanced Header with Live Status */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="mb-2">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2 text-primary" />
              Live Admin Dashboard
              <Badge bg="success" className="ms-2 fs-6">
                <FontAwesomeIcon icon={faSync} className={autoRefresh ? 'fa-spin' : ''} />
                {autoRefresh ? ' LIVE' : ' PAUSED'}
              </Badge>
            </h1>
            <p className="text-muted mb-0">
              <FontAwesomeIcon icon={faClock} className="me-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
              {liveMetrics && (
                <span className="ms-3">
                  <FontAwesomeIcon icon={faUsers} className="me-1" />
                  {liveMetrics.activeUsers} active users
                </span>
              )}
            </p>
          </Col>
          <Col md={6} className="text-end">
            <div className="d-flex justify-content-end align-items-center gap-2">
              <Form.Check
                type="switch"
                id="auto-refresh-switch"
                label="Auto Refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="me-3"
              />
              <Form.Select
                size="sm"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                style={{ width: '120px' }}
                className="me-2"
              >
                <option value={10}>10 sec</option>
                <option value={30}>30 sec</option>
                <option value={60}>1 min</option>
                <option value={300}>5 min</option>
              </Form.Select>
              <Button variant="outline-success" size="sm" onClick={fetchData}>
                <FontAwesomeIcon icon={faSync} />
              </Button>
              <Button variant="outline-primary" size="sm">
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                Export
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Live Metrics Bar */}
      {liveMetrics && (
        <Card className="mb-4 border-info">
          <Card.Body className="py-2">
            <Row className="text-center">
              <Col md={2}>
                <div className="d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-info me-2" />
                  <div>
                    <div className="fw-bold">{liveMetrics.ticketsCreatedToday}</div>
                    <small className="text-muted">Created Today</small>
                  </div>
                </div>
              </Col>
              <Col md={2}>
                <div className="d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                  <div>
                    <div className="fw-bold">{liveMetrics.ticketsCompletedToday}</div>
                    <small className="text-muted">Completed Today</small>
                  </div>
                </div>
              </Col>
              <Col md={2}>
                <div className="d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faClock} className="text-warning me-2" />
                  <div>
                    <div className="fw-bold">{liveMetrics.avgResponseTime}m</div>
                    <small className="text-muted">Avg Response</small>
                  </div>
                </div>
              </Col>
              <Col md={3}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">System Load</small>
                    <small className="fw-bold">{liveMetrics.systemLoad}%</small>
                  </div>
                  <ProgressBar
                    now={liveMetrics.systemLoad}
                    variant={liveMetrics.systemLoad > 80 ? 'danger' : liveMetrics.systemLoad > 60 ? 'warning' : 'success'}
                    style={{ height: '6px' }}
                  />
                </div>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setShowHistoryModal(true)}
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faHistory} className="me-1" />
                  View Ticket History
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Enhanced Live Metrics Widget */}
      <Row className="mb-4">
        <Col>
          <LiveMetricsWidget
            autoRefresh={autoRefresh}
            refreshInterval={refreshInterval}
          />
        </Col>
      </Row>

      {/* Ticket Flow Visualization */}
      <Row className="mb-4">
        <Col md={8}>
          <TicketFlowChart
            data={ticketHistory.slice(0, 8).map(entry => ({
              id: entry.ticketId,
              title: entry.ticketTitle,
              fromUser: entry.fromUser,
              toUser: entry.toUser,
              department: entry.department,
              status: entry.toStatus,
              priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
              duration: entry.duration,
              timestamp: entry.timestamp
            }))}
            title="Live Ticket Flow & Routing"
          />
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                Performance Summary
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <h2 className="text-success mb-1">
                  {Math.round((departmentStats.reduce((sum, dept) => sum + dept.completedTickets, 0) /
                    departmentStats.reduce((sum, dept) => sum + dept.totalTickets, 0)) * 100) || 0}%
                </h2>
                <p className="text-muted mb-0">Overall Efficiency</p>
              </div>

              <div className="mb-3">
                <small className="text-muted">Department Performance</small>
                {departmentStats.slice(0, 3).map((dept, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small">{dept.department}</span>
                    <div className="d-flex align-items-center">
                      <ProgressBar
                        now={dept.efficiency}
                        variant={dept.efficiency > 85 ? 'success' : dept.efficiency > 70 ? 'warning' : 'danger'}
                        style={{ width: '60px', height: '6px' }}
                        className="me-2"
                      />
                      <small className="text-muted">{dept.efficiency}%</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3">
                <Row className="text-center">
                  <Col xs={6}>
                    <div className="border-end">
                      <h5 className="text-primary mb-1">{liveMetrics?.activeUsers || 0}</h5>
                      <small className="text-muted">Active Users</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <h5 className="text-info mb-1">{liveMetrics?.avgResponseTime || 0}m</h5>
                    <small className="text-muted">Avg Response</small>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <FontAwesomeIcon icon={faTicketAlt} size="2x" className="text-primary mb-2" />
              <h3 className="mb-1">{stats?.totalTickets || 0}</h3>
              <p className="text-muted mb-0">Total Tickets</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <FontAwesomeIcon icon={faSpinner} size="2x" className="text-warning mb-2" />
              <h3 className="mb-1">{stats?.inProgressTickets || 0}</h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <FontAwesomeIcon icon={faCheckCircle} size="2x" className="text-success mb-2" />
              <h3 className="mb-1">{stats?.completedTickets || 0}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-danger mb-2" />
              <h3 className="mb-1">{stats?.criticalTickets || 0}</h3>
              <p className="text-muted mb-0">Critical</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tickets by Status</h5>
            </Card.Header>
            <Card.Body>
              <Pie data={statusChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tickets by Category</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={categoryChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tickets by Priority</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={priorityChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ticket Trends (Last 30 Days)</h5>
            </Card.Header>
            <Card.Body>
              <Line data={trendChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Department Performance Analytics */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faBuilding} className="me-2" />
            Department Performance Analytics
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {departmentStats.map((dept, index) => (
              <Col md={4} key={index} className="mb-3">
                <Card className="h-100 border-start border-4 border-primary">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-primary">{dept.department}</h6>
                      <Badge bg={dept.efficiency > 85 ? 'success' : dept.efficiency > 70 ? 'warning' : 'danger'}>
                        {dept.efficiency}% Efficiency
                      </Badge>
                    </div>

                    <Row className="text-center">
                      <Col xs={6}>
                        <div className="border-end">
                          <div className="fw-bold text-info">{dept.totalTickets}</div>
                          <small className="text-muted">Total</small>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div>
                          <div className="fw-bold text-success">{dept.completedTickets}</div>
                          <small className="text-muted">Completed</small>
                        </div>
                      </Col>
                    </Row>

                    <hr className="my-2" />

                    <Row className="text-center">
                      <Col xs={6}>
                        <div className="border-end">
                          <div className="fw-bold text-warning">{dept.activeTickets}</div>
                          <small className="text-muted">Active</small>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div>
                          <div className="fw-bold text-secondary">{dept.avgResolutionTime}h</div>
                          <small className="text-muted">Avg Time</small>
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-2">
                      <ProgressBar
                        now={(dept.completedTickets / dept.totalTickets) * 100}
                        variant="success"
                        style={{ height: '6px' }}
                        label={`${Math.round((dept.completedTickets / dept.totalTickets) * 100)}%`}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Filters and Ticket Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              All Tickets
            </h5>
            <Badge bg="secondary">{tickets.length} tickets</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                >
                  <option value="">All Statuses</option>
                  <option value="1">Open</option>
                  <option value="2">In Progress</option>
                  <option value="3">Completed</option>
                  <option value="4">Closed</option>
                  <option value="5">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                >
                  <option value="">All Priorities</option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                  <option value="4">Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                  <option value="">All Categories</option>
                  <option value="1">Plumbing</option>
                  <option value="2">Electrical</option>
                  <option value="3">Cleaning</option>
                  <option value="4">HVAC</option>
                  <option value="5">General</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search tickets..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Tickets Table */}
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Ticket Flow</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Badge bg="secondary">#{ticket.id.toString().padStart(4, '0')}</Badge>
                    </td>
                    <td>
                      <div className="fw-bold">{ticket.title}</div>
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faBuilding} className="me-1" />
                        {ticket.location}
                      </small>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeColor(ticket.status)}>
                        {ticket.statusText}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priorityText}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUserCog} className="text-primary me-2" />
                        <span className="fw-bold">{ticket.categoryText}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ticket-flow">
                        <div className="d-flex align-items-center mb-1">
                          <small className="text-muted me-2">From:</small>
                          <Badge bg="light" text="dark" className="me-2">
                            {ticket.createdByUserName}
                          </Badge>
                        </div>
                        {ticket.assignedToUserName && (
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faArrowRight} className="text-muted me-2" />
                            <small className="text-muted me-2">To:</small>
                            <Badge bg="info" className="me-2">
                              {ticket.assignedToUserName}
                            </Badge>
                          </div>
                        )}
                        {!ticket.assignedToUserName && (
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faRoute} className="text-warning me-2" />
                            <small className="text-warning">Awaiting Assignment</small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">
                          {calculateDuration(ticket.createdAt, ticket.completedAt)}
                        </div>
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowHistoryModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => window.open(`/tickets/${ticket.id}`, '_blank')}
                        >
                          <FontAwesomeIcon icon={faHistory} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faTicketAlt} size="3x" className="text-muted mb-3" />
              <p className="text-muted">No tickets found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Ticket History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Ticket History & Flow Analysis
            {selectedTicket && (
              <Badge bg="primary" className="ms-2">
                #{selectedTicket.id.toString().padStart(4, '0')}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h6 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faRoute} className="me-2 text-primary" />
                Recent Ticket Activities
              </h6>
              <div className="ticket-history-timeline">
                {ticketHistory.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="d-flex mb-3 p-3 border rounded">
                    <div className="flex-shrink-0 me-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faTicketAlt} />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-1">
                          <Badge bg="secondary" className="me-2">
                            #{entry.ticketId.toString().padStart(4, '0')}
                          </Badge>
                          {entry.ticketTitle}
                        </h6>
                        <small className="text-muted">
                          {new Date(entry.timestamp).toLocaleString()}
                        </small>
                      </div>
                      <div className="mb-2">
                        <Badge bg="light" text="dark" className="me-2">
                          {entry.fromUser}
                        </Badge>
                        <FontAwesomeIcon icon={faArrowRight} className="text-muted me-2" />
                        <Badge bg="info" className="me-2">
                          {entry.toUser}
                        </Badge>
                        <Badge bg="warning" text="dark">
                          {entry.department}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                          Status: <strong>{entry.fromStatus}</strong> → <strong>{entry.toStatus}</strong>
                        </span>
                        <Badge bg="secondary">{entry.duration}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />
                Quick Stats
              </h6>
              <Card className="mb-3">
                <Card.Body>
                  <div className="text-center">
                    <h4 className="text-primary">{ticketHistory.length}</h4>
                    <p className="text-muted mb-0">Total Activities</p>
                  </div>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <div className="text-center">
                    <h4 className="text-success">{departmentStats.reduce((sum, dept) => sum + dept.completedTickets, 0)}</h4>
                    <p className="text-muted mb-0">Completed Tickets</p>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <div className="text-center">
                    <h4 className="text-warning">{departmentStats.reduce((sum, dept) => sum + dept.activeTickets, 0)}</h4>
                    <p className="text-muted mb-0">Active Tickets</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            Export History
          </Button>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );

  // Helper functions
  function calculateDuration(createdAt: string, completedAt?: string): string {
    const start = new Date(createdAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    } else {
      return `${diffHours}h`;
    }
  }

  function getStatusBadgeColor(status: number): string {
    switch (status) {
      case 1: return 'primary'; // Open
      case 2: return 'warning'; // In Progress
      case 3: return 'success'; // Completed
      case 4: return 'secondary'; // Closed
      case 5: return 'danger'; // Cancelled
      default: return 'secondary';
    }
  }

  function getPriorityBadgeColor(priority: number): string {
    switch (priority) {
      case 1: return 'success'; // Low
      case 2: return 'info'; // Medium
      case 3: return 'warning'; // High
      case 4: return 'danger'; // Critical
      default: return 'secondary';
    }
  }
};

export default AdminDashboardPage;
