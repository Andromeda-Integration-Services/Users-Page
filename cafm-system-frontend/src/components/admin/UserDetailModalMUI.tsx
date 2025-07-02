import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
  Stack,
  LinearProgress,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LocationOn as LocationOnIcon,
  Computer as ComputerIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { greenAdminTheme, statusColors } from '../../theme/greenTheme';
import adminUserService, { 
  type AdminUser, 
  type UserLoginHistory, 
  type UserActivity, 
  type UserStatistics 
} from '../../api/adminUserService';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-detail-tabpanel-${index}`}
      aria-labelledby={`user-detail-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const UserDetailModalMUI: React.FC<UserDetailModalProps> = ({ open, onClose, user }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loginHistory, setLoginHistory] = useState<UserLoginHistory[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      fetchUserData();
    }
  }, [open, user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const [loginHistoryData, activityData, statsData] = await Promise.all([
        adminUserService.getUserLoginHistory(user.id, 1, 10),
        adminUserService.getUserActivity(user.id, 1, 10),
        adminUserService.getUserStatistics(user.id)
      ]);

      setLoginHistory(loginHistoryData);
      setUserActivity(activityData);
      setUserStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getUserAvatar = (user: AdminUser) => (
    <Avatar
      sx={{
        bgcolor: greenAdminTheme.palette.primary.main,
        width: 80,
        height: 80,
        fontSize: '2rem',
        fontWeight: 'bold'
      }}
    >
      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
    </Avatar>
  );

  const getStatusChip = (isActive: boolean) => (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'error'}
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
        size="medium"
        sx={{
          backgroundColor: alpha(roleColorMap[role] || greenAdminTheme.palette.primary.main, 0.1),
          color: roleColorMap[role] || greenAdminTheme.palette.primary.main,
          fontWeight: 'medium',
          margin: '4px'
        }}
      />
    ));
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 1, color: greenAdminTheme.palette.primary.main }} />
            <Typography variant="h5" component="div">
              User Details
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* User Header */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                {getUserAvatar(user)}
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {user.fullName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    icon={<BadgeIcon />}
                    label={`ID: ${user.employeeId}`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<BusinessIcon />}
                    label={user.department}
                    color="secondary"
                    size="small"
                  />
                  {getStatusChip(user.isActive)}
                </Stack>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {getRoleChips(user.roles)}
                </Box>
              </Grid>
              <Grid item>
                <Stack spacing={1} alignItems="center">
                  <Badge badgeContent={user.unreadMessages} color="error">
                    <MessageIcon color="action" />
                  </Badge>
                  <Typography variant="caption" color="text.secondary">
                    Messages
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="user detail tabs">
            <Tab label="Overview" icon={<PersonIcon />} />
            <Tab label="Statistics" icon={<AnalyticsIcon />} />
            <Tab label="Login History" icon={<HistoryIcon />} />
            <Tab label="Activity" icon={<AssignmentIcon />} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Full Name:</Typography>
                      <Typography variant="body2" fontWeight="bold">{user.fullName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body2" fontWeight="bold">{user.email}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Employee ID:</Typography>
                      <Typography variant="body2" fontWeight="bold">{user.employeeId}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Department:</Typography>
                      <Typography variant="body2" fontWeight="bold">{user.department}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      {getStatusChip(user.isActive)}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Account Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Created:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last Login:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last Activity:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {user.lastActivityAt
                          ? new Date(user.lastActivityAt).toLocaleDateString()
                          : 'No activity'
                        }
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Unread Messages:</Typography>
                      <Badge badgeContent={user.unreadMessages} color="error">
                        <MessageIcon color="action" />
                      </Badge>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: greenAdminTheme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {user.totalTicketsCreated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Created
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: greenAdminTheme.palette.warning.main, mb: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {user.totalTicketsAssigned}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Assigned
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: statusColors.active, mb: 1 }} />
                  <Typography variant="h4" sx={{ color: statusColors.active }}>
                    {user.totalTicketsCompleted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MessageIcon sx={{ fontSize: 40, color: greenAdminTheme.palette.info.main, mb: 1 }} />
                  <Typography variant="h4" color="info.main">
                    {user.unreadMessages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unread Messages
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {userStats && (
            <Card elevation={1} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2">Completion Rate</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {userStats.completionRate.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={userStats.completionRate}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Total Logins:</Typography>
                      <Typography variant="body2" fontWeight="bold">{userStats.totalLogins}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Account Age:</Typography>
                      <Typography variant="body2" fontWeight="bold">{userStats.accountAge} days</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loginHistory.map((login) => (
                  <TableRow key={login.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {new Date(login.loginTime).toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {login.ipAddress}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <ComputerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Tooltip title={login.userAgent}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {login.userAgent}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={login.isSuccessful ? 'Success' : 'Failed'}
                        color={login.isSuccessful ? 'success' : 'error'}
                        size="small"
                        icon={login.isSuccessful ? <LoginIcon /> : <ErrorIcon />}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Activity Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Related Entity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userActivity.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {new Date(activity.timestamp).toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={activity.activityType}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {activity.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {activity.relatedEntityType && activity.relatedEntityId && (
                        <Chip
                          label={`${activity.relatedEntityType}: ${activity.relatedEntityId}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModalMUI;
