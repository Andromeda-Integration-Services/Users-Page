import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faFilter,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
  faCalendarAlt,
  faUser,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import ticketService from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ProfessionalTicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Ticket>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return faExclamationTriangle;
      case 'in progress':
        return faSpinner;
      case 'completed':
        return faCheckCircle;
      case 'closed':
        return faCheckCircle;
      default:
        return faClock;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'badge-warning';
      case 'in progress':
        return 'badge-info';
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

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Ticket) => {
    if (sortField !== field) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  const filteredAndSortedTickets = tickets
    .filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || ticket.status === statusFilter;
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading service requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-danger-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error Loading Tickets</h3>
            <p className="mt-1 text-sm text-danger-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="gov-card">
        <div className="gov-card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-gov pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-gov"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-gov"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Service Requests ({filteredAndSortedTickets.length})
            </h3>
            <Link to="/tickets/new" className="btn-gov-primary">
              Create New Request
            </Link>
          </div>
        </div>
        <div className="gov-card-body p-0">
          <div className="overflow-x-auto">
            <table className="table-gov">
              <thead>
                <tr>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      <FontAwesomeIcon icon={getSortIcon('title')} className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <FontAwesomeIcon icon={getSortIcon('status')} className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Priority</span>
                      <FontAwesomeIcon icon={getSortIcon('priority')} className="h-3 w-3" />
                    </div>
                  </th>
                  <th>Location</th>
                  <th>Assigned To</th>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      <FontAwesomeIcon icon={getSortIcon('createdAt')} className="h-3 w-3" />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${getStatusBadge(ticket.status)} flex items-center`}>
                        <FontAwesomeIcon icon={getStatusIcon(ticket.status)} className="mr-1 h-3 w-3" />
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="text-sm text-gray-900">{ticket.location}</td>
                    <td>
                      {ticket.assignedTo ? (
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center text-sm text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="text-primary-600 hover:text-primary-700"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </Link>
                        {hasRole('Admin') && (
                          <>
                            <button
                              className="text-warning-600 hover:text-warning-700"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                            </button>
                            <button
                              className="text-danger-600 hover:text-danger-700"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTicketList;
