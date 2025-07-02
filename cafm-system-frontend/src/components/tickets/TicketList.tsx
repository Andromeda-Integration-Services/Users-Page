import React, { useState, useEffect, useRef } from 'react';
import { Table, Badge, Button, Form, Row, Col, Pagination, Card, InputGroup, Dropdown, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ticketService, { Ticket, TicketFilterOptions } from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faFilter,
  faSortAmountDown,
  faUserFriends,
  faSearch,
  faTimes,
  faSort,
  faSortUp,
  faSortDown,
  faFilterCircleXmark,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const TicketList: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<TicketFilterOptions>({
    pageNumber: 1,
    pageSize: 10,
  });

  // Column filter states
  const [columnFilters, setColumnFilters] = useState<{[key: string]: string}>({
    id: '',
    title: '',
    requestedBy: '',
    onBehalfOf: '',
    status: '',
    priority: '',
    category: '',
    type: '',
    created: ''
  });
  const [activeColumnFilter, setActiveColumnFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  // Refs for column filter inputs
  const filterRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: '1', label: 'Open' },
    { value: '2', label: 'In Progress' },
    { value: '3', label: 'Completed' },
    { value: '4', label: 'Closed' },
    { value: '5', label: 'Cancelled' },
  ];

  // Priority options
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Critical' },
  ];

  // Category options (matching backend TicketCategory enum exactly)
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: '1', label: 'General' },      // TicketCategory.General = 1
    { value: '2', label: 'Plumbing' },     // TicketCategory.Plumbing = 2
    { value: '3', label: 'Electrical' },   // TicketCategory.Electrical = 3
    { value: '4', label: 'HVAC' },         // TicketCategory.HVAC = 4
    { value: '5', label: 'Cleaning' },     // TicketCategory.Cleaning = 5
    { value: '6', label: 'Security' },     // TicketCategory.Security = 6
    { value: '7', label: 'IT' },           // TicketCategory.IT = 7
    { value: '8', label: 'Maintenance' },  // TicketCategory.Maintenance = 8
    { value: '9', label: 'Safety' },       // TicketCategory.Safety = 9
    { value: '10', label: 'Other' },       // TicketCategory.Other = 10
  ];

  // Type options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: '1', label: 'Material Request' },
    { value: '2', label: 'Service Request' },
  ];

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getTickets(filters);
      setTickets(response.tickets);
      setTotalCount(response.totalCount);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    // Convert string values to numbers for backend
    if (name === 'status' || name === 'priority' || name === 'category' || name === 'type') {
      processedValue = value ? parseInt(value) : undefined;
    }

    setFilters(prev => ({
      ...prev,
      [name]: processedValue,
      pageNumber: 1, // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      pageNumber: page,
    }));
  };

  // Get status badge variant
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: // Open
        return 'primary';
      case 2: // InProgress
        return 'warning';
      case 3: // Completed
        return 'success';
      case 4: // Closed
        return 'secondary';
      case 5: // Cancelled
        return 'danger';
      default:
        return 'info';
    }
  };

  // Get priority badge variant
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1: // Low
        return 'info';
      case 2: // Medium
        return 'secondary';
      case 3: // High
        return 'warning';
      case 4: // Critical
        return 'danger';
      default:
        return 'light';
    }
  };

  // Column filtering functions
  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearColumnFilter = (column: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: ''
    }));
    setActiveColumnFilter(null);
  };

  const clearAllColumnFilters = () => {
    setColumnFilters({
      id: '',
      title: '',
      requestedBy: '',
      onBehalfOf: '',
      status: '',
      priority: '',
      category: '',
      type: '',
      created: ''
    });
    setActiveColumnFilter(null);
  };

  // Sorting functions
  const handleSort = (column: string) => {
    setSortConfig(prev => {
      if (prev?.key === column) {
        return { key: column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: column, direction: 'asc' };
    });
  };

  const getSortIcon = (column: string) => {
    if (sortConfig?.key !== column) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };

  // Filter tickets based on column filters
  const filteredTickets = tickets.filter(ticket => {
    return (
      ticket.id.toString().toLowerCase().includes(columnFilters.id.toLowerCase()) &&
      ticket.title.toLowerCase().includes(columnFilters.title.toLowerCase()) &&
      ticket.requestedByUserName.toLowerCase().includes(columnFilters.requestedBy.toLowerCase()) &&
      (ticket.onBehalfOf || '').toLowerCase().includes(columnFilters.onBehalfOf.toLowerCase()) &&
      ticket.statusText.toLowerCase().includes(columnFilters.status.toLowerCase()) &&
      ticket.priorityText.toLowerCase().includes(columnFilters.priority.toLowerCase()) &&
      ticket.categoryText.toLowerCase().includes(columnFilters.category.toLowerCase()) &&
      ticket.typeText.toLowerCase().includes(columnFilters.type.toLowerCase()) &&
      new Date(ticket.createdAt).toLocaleDateString().toLowerCase().includes(columnFilters.created.toLowerCase())
    );
  });

  // Sort filtered tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue: any, bValue: any;
    switch (sortConfig.key) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'requestedBy':
        aValue = a.requestedByUserName;
        bValue = b.requestedByUserName;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        aValue = a.priority;
        bValue = b.priority;
        break;
      case 'category':
        aValue = a.categoryText;
        bValue = b.categoryText;
        break;
      case 'type':
        aValue = a.typeText;
        bValue = b.typeText;
        break;
      case 'created':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / (filters.pageSize || 10));
  const currentPage = filters.pageNumber || 1;

  // Get role-based visibility message (Updated for one-to-one department mapping)
  const getVisibilityMessage = () => {
    if (hasRole('Admin')) {
      return { text: "Admin View: You can see ALL tickets in the system and assign them to service providers", variant: "success" };
    } else if (hasRole('Manager')) {
      return { text: "Manager View: You can see ALL tickets for assignment and monitoring", variant: "info" };
    } else if (hasRole('Plumber')) {
      return { text: "Plumber View: You can see ONLY Plumbing tickets + tickets you created", variant: "warning" };
    } else if (hasRole('Electrician')) {
      return { text: "Electrician View: You can see ONLY Electrical tickets + tickets you created", variant: "warning" };
    } else if (hasRole('Cleaner')) {
      return { text: "Cleaner View: You can see ONLY Cleaning tickets + tickets you created", variant: "warning" };
    } else if (hasRole('HVACTechnician')) {
      return { text: "HVAC Technician View: You can see ONLY HVAC tickets + tickets you created", variant: "warning" };
    } else if (hasRole('SecurityPersonnel')) {
      return { text: "Security Personnel View: You can see ONLY Security tickets + tickets you created", variant: "warning" };
    } else if (hasRole('ITSupport')) {
      return { text: "IT Support View: You can see ONLY IT tickets + tickets you created", variant: "warning" };
    } else if (hasRole('Engineer')) {
      return { text: "Engineer View: You can see ONLY Maintenance and Safety tickets + tickets you created", variant: "warning" };
    } else if (hasRole('EndUser')) {
      return { text: "End User View: You can see ONLY tickets you created", variant: "primary" };
    } else {
      return { text: "Default View: You can see only tickets you created", variant: "secondary" };
    }
  };

  const visibilityInfo = getVisibilityMessage();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Service Requests</h2>
        <div className="d-flex gap-2">
          {Object.values(columnFilters).some(filter => filter !== '') && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearAllColumnFilters}
              title="Clear all column filters"
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} className="me-1" />
              Clear Filters
            </Button>
          )}
          <Badge bg="info" className="fs-6 px-3 py-2">
            {sortedTickets.length} of {tickets.length} tickets
          </Badge>
        </div>
      </div>

      {/* Role-based Visibility Alert */}
      <Alert variant={visibilityInfo.variant} className="mb-4">
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
        <strong>Ticket Visibility:</strong> {visibilityInfo.text}
      </Alert>

      {/* Enhanced Filters Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Advanced Filters
            </h5>
            <small>Use filters below or click column headers for Excel-like filtering</small>
          </div>
        </Card.Header>
        <Card.Body className="bg-light">{/* Filters */}
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={filters.priority || ''}
                onChange={handleFilterChange}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={filters.type || ''}
                onChange={handleFilterChange}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                placeholder="Search tickets..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, pageNumber: 1 }))}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Request Type</Form.Label>
              <Form.Select
                name="requestType"
                value={filters.requestType || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, requestType: e.target.value, pageNumber: 1 }))}
              >
                <option value="">All Requests</option>
                <option value="direct">Direct Requests</option>
                <option value="onbehalf">On Behalf Of Requests</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Button
              variant="primary"
              className="mb-3 w-100"
              as={Link}
              to="/tickets/new"
            >
              Create New Ticket
            </Button>
          </Col>
        </Row>
        </Card.Body>
      </Card>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Tickets Table with Column Filters */}
          <Card className="shadow-sm cafm-professional-card">
            <Card.Header className="cafm-card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white fw-bold">Service Requests Table</h5>
                <small className="text-white-50">Click column headers to sort • Use filter icons for Excel-like filtering</small>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Table striped bordered hover className="mb-0 cafm-professional-table">
                  <thead className="cafm-table-header">
                  <tr>
                    {/* ID Column */}
                    <th style={{ minWidth: '100px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('id')}
                          title="Click to sort"
                        >
                          ID <FontAwesomeIcon icon={getSortIcon('id')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'id'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'id' ? null : 'id')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['id'] = el}
                                  type="text"
                                  placeholder="Filter ID..."
                                  value={columnFilters.id}
                                  onChange={(e) => handleColumnFilter('id', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.id && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('id')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Title Column */}
                    <th style={{ minWidth: '200px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('title')}
                          title="Click to sort"
                        >
                          Title <FontAwesomeIcon icon={getSortIcon('title')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'title'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'title' ? null : 'title')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['title'] = el}
                                  type="text"
                                  placeholder="Filter Title..."
                                  value={columnFilters.title}
                                  onChange={(e) => handleColumnFilter('title', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.title && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('title')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Requested By Column */}
                    <th style={{ minWidth: '150px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('requestedBy')}
                          title="Click to sort"
                        >
                          Requested By <FontAwesomeIcon icon={getSortIcon('requestedBy')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'requestedBy'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'requestedBy' ? null : 'requestedBy')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['requestedBy'] = el}
                                  type="text"
                                  placeholder="Filter Requested By..."
                                  value={columnFilters.requestedBy}
                                  onChange={(e) => handleColumnFilter('requestedBy', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.requestedBy && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('requestedBy')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* On Behalf Of Column */}
                    <th style={{ minWidth: '150px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>On Behalf Of</span>
                        <Dropdown show={activeColumnFilter === 'onBehalfOf'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'onBehalfOf' ? null : 'onBehalfOf')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['onBehalfOf'] = el}
                                  type="text"
                                  placeholder="Filter On Behalf Of..."
                                  value={columnFilters.onBehalfOf}
                                  onChange={(e) => handleColumnFilter('onBehalfOf', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.onBehalfOf && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('onBehalfOf')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Status Column */}
                    <th style={{ minWidth: '120px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('status')}
                          title="Click to sort"
                        >
                          Status <FontAwesomeIcon icon={getSortIcon('status')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'status'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'status' ? null : 'status')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['status'] = el}
                                  type="text"
                                  placeholder="Filter Status..."
                                  value={columnFilters.status}
                                  onChange={(e) => handleColumnFilter('status', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.status && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('status')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Priority Column */}
                    <th style={{ minWidth: '120px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('priority')}
                          title="Click to sort"
                        >
                          Priority <FontAwesomeIcon icon={getSortIcon('priority')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'priority'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'priority' ? null : 'priority')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['priority'] = el}
                                  type="text"
                                  placeholder="Filter Priority..."
                                  value={columnFilters.priority}
                                  onChange={(e) => handleColumnFilter('priority', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.priority && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('priority')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Category Column */}
                    <th style={{ minWidth: '120px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('category')}
                          title="Click to sort"
                        >
                          Category <FontAwesomeIcon icon={getSortIcon('category')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'category'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'category' ? null : 'category')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['category'] = el}
                                  type="text"
                                  placeholder="Filter Category..."
                                  value={columnFilters.category}
                                  onChange={(e) => handleColumnFilter('category', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.category && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('category')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Type Column */}
                    <th style={{ minWidth: '120px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('type')}
                          title="Click to sort"
                        >
                          Type <FontAwesomeIcon icon={getSortIcon('type')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'type'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'type' ? null : 'type')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['type'] = el}
                                  type="text"
                                  placeholder="Filter Type..."
                                  value={columnFilters.type}
                                  onChange={(e) => handleColumnFilter('type', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.type && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('type')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Created Column */}
                    <th style={{ minWidth: '120px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort('created')}
                          title="Click to sort"
                        >
                          Created <FontAwesomeIcon icon={getSortIcon('created')} className="ms-1" />
                        </span>
                        <Dropdown show={activeColumnFilter === 'created'} align="end">
                          <Dropdown.Toggle
                            variant="link"
                            size="sm"
                            className="text-white p-0 border-0"
                            onClick={() => setActiveColumnFilter(activeColumnFilter === 'created' ? null : 'created')}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: '200px' }}>
                            <div className="p-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  ref={el => filterRefs.current['created'] = el}
                                  type="text"
                                  placeholder="Filter Created..."
                                  value={columnFilters.created}
                                  onChange={(e) => handleColumnFilter('created', e.target.value)}
                                  autoFocus
                                />
                                {columnFilters.created && (
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => clearColumnFilter('created')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </InputGroup>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </th>

                    {/* Actions Column */}
                    <th style={{ minWidth: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTickets.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        {tickets.length === 0 ? (
                          <div>
                            <FontAwesomeIcon icon={faSearch} className="text-muted mb-2" size="2x" />
                            <div>No tickets found</div>
                          </div>
                        ) : (
                          <div>
                            <FontAwesomeIcon icon={faFilter} className="text-muted mb-2" size="2x" />
                            <div>No tickets match the current filters</div>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={clearAllColumnFilters}
                              className="mt-2"
                            >
                              Clear all filters
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    sortedTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{ticket.requestedByUserName}</span>
                        <small className="text-muted">{ticket.requestedByUserEmail}</small>
                      </div>
                    </td>
                    <td>
                      {ticket.onBehalfOf ? (
                        <div className="d-flex align-items-center">
                          <Badge bg="info" className="me-2">
                            <FontAwesomeIcon icon={faUserFriends} className="me-1" />
                            On Behalf
                          </Badge>
                          <span className="fw-bold">{ticket.onBehalfOf}</span>
                        </div>
                      ) : (
                        <span className="text-muted fst-italic">Direct request</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(ticket.status)}>
                        {ticket.statusText}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getPriorityBadge(ticket.priority)}>
                        {ticket.priorityText}
                      </Badge>
                    </td>
                    <td>{ticket.categoryText}</td>
                    <td>
                      <Badge bg={ticket.type === 1 ? 'warning' : 'info'}>
                        {ticket.typeText}
                      </Badge>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/tickets/${ticket.id}`}
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </Button>
                    </td>
                  </tr>
                    ))
                  )}
                </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Showing {((currentPage - 1) * (filters.pageSize || 10)) + 1} to {Math.min(currentPage * (filters.pageSize || 10), totalCount)} of {totalCount} entries
                    </small>
                  </div>
                  <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => {
                    // Add ellipsis
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <Pagination.Ellipsis disabled />
                          <Pagination.Item
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Pagination.Item>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    );
                  })}

                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* Enhanced CSS for Professional Table Styling */}
      <style>{`
        /* Professional CAFM Card Styling */
        .cafm-professional-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          background: var(--bg-primary);
        }

        .cafm-card-header {
          background: linear-gradient(135deg, var(--sap-blue) 0%, var(--sap-dark-blue) 100%) !important;
          border: none;
          padding: 1.5rem;
          color: white;
        }

        [data-theme="dark"] .cafm-card-header {
          background: linear-gradient(135deg, var(--sap-blue) 0%, var(--primary-blue) 100%) !important;
        }

        /* Professional CAFM Table Styling */
        .cafm-professional-table {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          border: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Professional Table Headers */
        .cafm-table-header th {
          background: linear-gradient(135deg, var(--sap-blue) 0%, var(--sap-dark-blue) 100%) !important;
          color: white !important;
          border: none !important;
          position: sticky;
          top: 0;
          z-index: 10;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          padding: 1.2rem 1rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Dark theme header adjustments */
        [data-theme="dark"] .cafm-table-header th {
          background: linear-gradient(135deg, var(--sap-blue) 0%, var(--primary-blue) 100%) !important;
          color: white !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .cafm-table-header th .dropdown-toggle {
          opacity: 0.8;
          transition: all 0.3s ease;
          border: none;
          background: none;
          color: white !important;
          padding: 0.25rem;
          border-radius: 50%;
        }

        .cafm-table-header th:hover .dropdown-toggle {
          opacity: 1;
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        .cafm-table-header th span[style*="cursor: pointer"] {
          transition: all 0.3s ease;
          color: white !important;
        }

        .cafm-table-header th span[style*="cursor: pointer"]:hover {
          color: #ffd700 !important;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        }

        /* Enhanced Dropdown Menus */
        .dropdown-menu {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem;
          background: var(--bg-primary);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
        }

        .dropdown-menu .form-control {
          border-radius: 8px;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .dropdown-menu .form-control:focus {
          border-color: var(--sap-blue);
          box-shadow: 0 0 0 0.2rem rgba(0, 112, 242, 0.25);
          background: var(--bg-primary);
        }

        /* Dark theme dropdown styling */
        [data-theme="dark"] .dropdown-menu {
          background: #1f2937 !important;
          border-color: #4b5563;
        }

        [data-theme="dark"] .dropdown-menu .form-control {
          background: #374151 !important;
          border-color: #4b5563;
          color: #f9fafb !important;
        }

        [data-theme="dark"] .dropdown-menu .form-control:focus {
          background: #1f2937 !important;
          border-color: var(--sap-blue);
          color: #f9fafb !important;
        }

        /* Professional Table Container */
        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--border-color);
        }

        /* Table Body Styling - Light Theme */
        .cafm-professional-table tbody tr {
          transition: all 0.3s ease;
          border: none;
          background: var(--bg-primary);
        }

        .cafm-professional-table tbody tr:nth-child(odd) {
          background: var(--bg-secondary);
        }

        .cafm-professional-table tbody tr:hover {
          background: linear-gradient(90deg, rgba(0, 112, 242, 0.08) 0%, rgba(0, 61, 107, 0.08) 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cafm-professional-table tbody td {
          padding: 1rem 1rem;
          vertical-align: middle;
          border-color: var(--border-color);
          color: var(--text-primary) !important;
          border-bottom: 1px solid var(--border-color);
          background: transparent;
        }

        /* Dark Theme Specific Styling */
        [data-theme="dark"] .cafm-professional-table tbody tr {
          background: #1f2937 !important; /* Consistent dark background */
        }

        [data-theme="dark"] .cafm-professional-table tbody tr:nth-child(odd) {
          background: #374151 !important; /* Lighter dark background for alternating rows */
        }

        [data-theme="dark"] .cafm-professional-table tbody tr:hover {
          background: linear-gradient(90deg, rgba(77, 166, 255, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%) !important;
        }

        [data-theme="dark"] .cafm-professional-table tbody td {
          color: #f9fafb !important; /* Ensure white text in dark theme */
          border-color: #4b5563;
        }

        /* Enhanced Badges */
        .badge {
          font-size: 0.75em;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: white !important; /* Ensure badge text is always visible */
        }

        /* Ensure all text elements in table are visible */
        .cafm-professional-table tbody td * {
          color: inherit !important;
        }

        .cafm-professional-table tbody td .fw-bold {
          color: var(--text-primary) !important;
        }

        .cafm-professional-table tbody td .text-muted {
          color: var(--text-secondary) !important;
        }

        .cafm-professional-table tbody td .fst-italic {
          color: var(--text-secondary) !important;
        }

        /* Dark theme text adjustments */
        [data-theme="dark"] .cafm-professional-table tbody td .fw-bold {
          color: #f9fafb !important;
        }

        [data-theme="dark"] .cafm-professional-table tbody td .text-muted {
          color: #d1d5db !important;
        }

        [data-theme="dark"] .cafm-professional-table tbody td .fst-italic {
          color: #d1d5db !important;
        }

        /* Professional Pagination */
        .pagination {
          gap: 0.5rem;
        }

        .pagination .page-link {
          border-radius: 8px;
          border: 2px solid var(--border-color);
          color: var(--sap-blue);
          background: var(--bg-primary);
          font-weight: 600;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }

        .pagination .page-link:hover {
          background: var(--sap-blue);
          color: white;
          border-color: var(--sap-blue);
          transform: translateY(-1px);
        }

        /* Ensure table is fully visible */
        .table-responsive {
          min-width: 100%;
          overflow-x: auto;
        }

        .cafm-professional-table {
          min-width: 1200px; /* Ensure minimum width to show all columns */
          width: 100%;
        }

        /* Responsive adjustments */
        @media (max-width: 1400px) {
          .cafm-professional-table {
            min-width: 1000px;
          }
        }

        @media (max-width: 1200px) {
          .cafm-professional-table {
            min-width: 900px;
          }

          .cafm-table-header th {
            padding: 1rem 0.75rem;
            font-size: 0.8rem;
          }

          .cafm-professional-table tbody td {
            padding: 0.75rem 0.75rem;
          }
        }

        .pagination .page-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .pagination .page-item.active .page-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .pagination .page-item.disabled .page-link {
          opacity: 0.5;
          background: #f8f9fa;
          border-color: #e9ecef;
        }

        /* Enhanced Cards */
        .card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1.5rem;
          font-weight: 600;
        }

        .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }

        .bg-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }

        /* Action Buttons */
        .btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-outline-secondary {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-outline-secondary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }

        /* Loading and Empty States */
        .spinner-border {
          width: 3rem;
          height: 3rem;
          border-width: 0.3rem;
        }

        .text-center .fa-search,
        .text-center .fa-filter {
          color: #667eea;
          margin-bottom: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .table-dark th {
            font-size: 0.75rem;
            padding: 1rem 0.5rem;
          }

          .table tbody td {
            padding: 0.75rem 0.5rem;
          }

          .pagination .page-link {
            padding: 0.5rem 0.75rem;
          }
        }

        /* Animation for filter results */
        @keyframes filterFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table tbody tr {
          animation: filterFadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default TicketList;
