import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  Fab,
  Badge,
  Stack,
  Divider,
  useTheme,
  alpha,
  ThemeProvider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { greenAdminTheme, statusColors } from '../theme/greenTheme';
import MainLayout from '../components/layout/MainLayout';
import adminUserService, { type AdminUser, type LoadingState, ApiError } from '../api/adminUserService';
import { useAuth } from '../context/AuthContext';
import UserDetailModalMUI from '../components/admin/UserDetailModalMUI';
import EditUserModalMUI from '../components/admin/EditUserModalMUI';
import SendMessageModalEnhanced from '../components/admin/SendMessageModalEnhanced';
import BulkMessageModal from '../components/admin/BulkMessageModal';

// Enhanced interfaces for better state management
interface UserFilters {
  searchTerm: string;
  department: string;
  role: string;
  status: 'all' | 'active' | 'inactive';
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalDepartments: number;
}

const AdminUsersPageMUI: React.FC = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Enhanced filter state
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    department: '',
    role: '',
    status: 'all'
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkMessage, setShowBulkMessage] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Statistics state
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalDepartments: 0
  });

  // Available options for filters
  const departments = ['Administration', 'IT', 'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Maintenance', 'Facilities', 'General'];
  const roles = ['Admin', 'Manager', 'Engineer', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'EndUser'];

  useEffect(() => {
    if (!hasRole('Admin')) {
      setLoadingState({
        isLoading: false,
        error: 'Access denied. Admin role required.',
        lastUpdated: null
      });
      return;
    }
    fetchUsers();
  }, [hasRole]);

  useEffect(() => {
    filterUsers();
    calculateStats();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const usersData = await adminUserService.getAllUsers(1, 1000);
      setUsers(usersData);
      
      setLoadingState({
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });
      
      showNotification('Users loaded successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch users';
      setLoadingState({
        isLoading: false,
        error: errorMessage,
        lastUpdated: null
      });
      showNotification(errorMessage, 'error');
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.employeeId.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.roles.includes(filters.role));
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => 
        filters.status === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const stats: UserStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      totalDepartments: new Set(users.map(u => u.department).filter(d => d)).size
    };
    setUserStats(stats);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset pagination when filters change
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // User action handlers
  const openUserDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const openEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const openSendMessage = (user: AdminUser) => {
    setSelectedUser(user);
    setShowSendMessage(true);
  };

  const openDeleteConfirm = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await adminUserService.toggleUserStatus(userId);
      await fetchUsers(); // Refresh the list
      showNotification('User status updated successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to update user status';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await adminUserService.deleteUser(selectedUser.id);
      await fetchUsers(); // Refresh the list
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete user';
      showNotification(errorMessage, 'error');
    }
  };

  // Helper functions for UI components
  const getStatusChip = (isActive: boolean) => (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'error'}
      size="small"
      icon={isActive ? <CheckCircleIcon /> : <ErrorIcon />}
      sx={{
        fontWeight: 'bold',
        backgroundColor: isActive ? statusColors.active : statusColors.inactive,
        color: 'white'
      }}
    />
  );

  const getRoleChips = (roles: string[]) => {
    const roleColorMap: { [key: string]: string } = {
      'Admin': '#d32f2f',
      'Manager': '#f57c00',
      'Engineer': '#1976d2',
      'Plumber': greenAdminTheme.palette.primary.main,
      'Electrician': greenAdminTheme.palette.primary.dark,
      'Cleaner': greenAdminTheme.palette.success.main,
      'HVACTechnician': greenAdminTheme.palette.secondary.main,
      'SecurityPersonnel': '#424242',
      'ITSupport': '#1976d2',
      'EndUser': '#757575'
    };

    return roles.map(role => (
      <Chip
        key={role}
        label={role}
        size="small"
        sx={{
          backgroundColor: alpha(roleColorMap[role] || greenAdminTheme.palette.primary.main, 0.1),
          color: roleColorMap[role] || greenAdminTheme.palette.primary.main,
          fontWeight: 'medium',
          margin: '2px',
          fontSize: '0.75rem'
        }}
      />
    ));
  };

  const getUserAvatar = (user: AdminUser) => (
    <Avatar
      sx={{
        bgcolor: greenAdminTheme.palette.primary.main,
        width: 40,
        height: 40,
        fontSize: '1rem',
        fontWeight: 'bold'
      }}
    >
      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
    </Avatar>
  );

  // Statistics cards component
  const StatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ color: greenAdminTheme.palette.primary.main, mr: 1 }} />
              <Box>
                <Typography variant="h4" component="div" color="primary">
                  {userStats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CheckCircleIcon sx={{ color: statusColors.active, mr: 1 }} />
              <Box>
                <Typography variant="h4" component="div" sx={{ color: statusColors.active }}>
                  {userStats.activeUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ErrorIcon sx={{ color: statusColors.inactive, mr: 1 }} />
              <Box>
                <Typography variant="h4" component="div" sx={{ color: statusColors.inactive }}>
                  {userStats.inactiveUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <BusinessIcon sx={{ color: greenAdminTheme.palette.secondary.main, mr: 1 }} />
              <Box>
                <Typography variant="h4" component="div" color="secondary">
                  {userStats.totalDepartments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Filters toolbar component
  const FiltersToolbar = () => (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              label="Department"
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <MenuItem value="">All Roles</MenuItem>
              {roles.map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value as 'all' | 'active' | 'inactive')}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchUsers} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export">
              <IconButton color="primary">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );

  // Calculate pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Access denied check
  if (!hasRole('Admin')) {
    return (
      <ThemeProvider theme={greenAdminTheme}>
        <MainLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Alert severity="error">
              <AlertTitle>Access Denied</AlertTitle>
              Admin role required to view this page.
            </Alert>
          </Container>
        </MainLayout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={greenAdminTheme}>
      <MainLayout>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${greenAdminTheme.palette.primary[50]} 0%, ${alpha(greenAdminTheme.palette.primary.main, 0.05)} 100%)`,
            minHeight: '100vh',
            py: 3
          }}
        >
          <Container maxWidth="xl">
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom color="primary">
                <PeopleIcon sx={{ mr: 2, fontSize: 'inherit' }} />
                User Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage system users, roles, and permissions
                {loadingState.lastUpdated && (
                  <Typography component="span" variant="caption" sx={{ ml: 2 }}>
                    Last updated: {loadingState.lastUpdated.toLocaleTimeString()}
                  </Typography>
                )}
              </Typography>
            </Box>

            {/* Loading indicator */}
            {loadingState.isLoading && (
              <LinearProgress sx={{ mb: 2 }} />
            )}

            {/* Error alert */}
            {loadingState.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error</AlertTitle>
                {loadingState.error}
              </Alert>
            )}

            {/* Statistics Cards */}
            <StatsCards />

            {/* Filters */}
            <FiltersToolbar />

            {/* Users Table */}
            <Paper elevation={2}>
              <Toolbar sx={{ pl: 2, pr: 1 }}>
                <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
                  Users ({filteredUsers.length})
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Send Bulk Message">
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={() => setShowBulkMessage(true)}
                      color="secondary"
                    >
                      Bulk Message
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add User">
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowCreateUser(true)}
                    >
                      Add User
                    </Button>
                  </Tooltip>
                </Stack>
              </Toolbar>
              <Divider />

              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Tickets</TableCell>
                      <TableCell>Messages</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getUserAvatar(user)}
                            <Box ml={2}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {user.fullName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.department}
                            size="small"
                            icon={<BusinessIcon />}
                            sx={{
                              backgroundColor: alpha(greenAdminTheme.palette.secondary.main, 0.1),
                              color: greenAdminTheme.palette.secondary.main
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {getRoleChips(user.roles)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(user.isActive)}
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              Created: {user.totalTicketsCreated}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Assigned: {user.totalTicketsAssigned}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Completed: {user.totalTicketsCompleted}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={user.unreadMessages} color="error">
                            <MessageIcon color="action" />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.lastLoginAt
                              ? new Date(user.lastLoginAt).toLocaleDateString()
                              : 'Never'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => openUserDetail(user)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                onClick={() => openEditUser(user)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Send Message">
                              <IconButton
                                size="small"
                                onClick={() => openSendMessage(user)}
                                color="secondary"
                              >
                                <EmailIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleUserStatus(user.id)}
                                color={user.isActive ? 'warning' : 'success'}
                              >
                                {user.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                onClick={() => openDeleteConfirm(user)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Container>
        </Box>
      </MainLayout>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Confirm Delete User
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.fullName}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add user"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => setShowCreateUser(true)}
      >
        <AddIcon />
      </Fab>

      {/* Modals */}
      <UserDetailModalMUI
        open={showUserDetail}
        onClose={() => setShowUserDetail(false)}
        user={selectedUser}
      />

      <EditUserModalMUI
        open={showEditUser}
        onClose={() => setShowEditUser(false)}
        onUserUpdated={fetchUsers}
        user={selectedUser}
      />

      <SendMessageModalEnhanced
        open={showSendMessage}
        onClose={() => setShowSendMessage(false)}
        onMessageSent={() => {
          showNotification('Message sent successfully', 'success');
          fetchUsers(); // Refresh to update unread message counts
        }}
        user={selectedUser}
      />

      <BulkMessageModal
        open={showBulkMessage}
        onClose={() => setShowBulkMessage(false)}
        onMessagesSent={() => {
          showNotification('Bulk messages sent successfully', 'success');
          fetchUsers(); // Refresh to update unread message counts
        }}
        users={users}
      />
    </ThemeProvider>
  );
};

export default AdminUsersPageMUI;
