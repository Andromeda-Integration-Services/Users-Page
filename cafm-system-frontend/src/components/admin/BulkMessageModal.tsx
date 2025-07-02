import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  FormHelperText,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  Priority as PriorityIcon,
  Category as CategoryIcon,
  SelectAll as SelectAllIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { greenAdminTheme } from '../../theme/greenTheme';
import adminUserService, { type AdminUser, type CreateMessage, ApiError } from '../../api/adminUserService';

interface BulkMessageModalProps {
  open: boolean;
  onClose: () => void;
  onMessagesSent: () => void;
  users: AdminUser[];
}

interface FormData {
  subject: string;
  message: string;
  messageType: string;
  priority: string;
  selectedUsers: string[];
  filterByDepartment: string;
  filterByRole: string;
  filterByStatus: 'all' | 'active' | 'inactive';
}

interface FormErrors {
  [key: string]: string;
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({ open, onClose, onMessagesSent, users }) => {
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    message: '',
    messageType: 'General',
    priority: 'Normal',
    selectedUsers: [],
    filterByDepartment: '',
    filterByRole: '',
    filterByStatus: 'all'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Message types and priorities
  const messageTypes = [
    { value: 'General', label: 'General Message', color: 'primary' },
    { value: 'Task', label: 'Task Assignment', color: 'warning' },
    { value: 'Alert', label: 'Alert/Warning', color: 'error' },
    { value: 'Announcement', label: 'Announcement', color: 'info' }
  ];

  const priorities = [
    { value: 'Low', label: 'Low Priority', color: '#4caf50' },
    { value: 'Normal', label: 'Normal Priority', color: '#2196f3' },
    { value: 'High', label: 'High Priority', color: '#ff9800' },
    { value: 'Urgent', label: 'Urgent', color: '#f44336' }
  ];

  // Get unique departments and roles
  const departments = [...new Set(users.map(u => u.department).filter(d => d))];
  const roles = [...new Set(users.flatMap(u => u.roles))];

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError(null);
  };

  const getFilteredUsers = () => {
    let filtered = [...users];

    // Apply department filter
    if (formData.filterByDepartment) {
      filtered = filtered.filter(user => user.department === formData.filterByDepartment);
    }

    // Apply role filter
    if (formData.filterByRole) {
      filtered = filtered.filter(user => user.roles.includes(formData.filterByRole));
    }

    // Apply status filter
    if (formData.filterByStatus !== 'all') {
      filtered = filtered.filter(user => 
        formData.filterByStatus === 'active' ? user.isActive : !user.isActive
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedUsers: [...prev.selectedUsers, userId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedUsers: prev.selectedUsers.filter(id => id !== userId)
      }));
    }
  };

  const handleSelectAll = () => {
    const allFilteredUserIds = filteredUsers.map(u => u.id);
    setFormData(prev => ({
      ...prev,
      selectedUsers: allFilteredUserIds
    }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    // Recipients validation
    if (formData.selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Please select at least one recipient';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);

      // Send messages to all selected users
      const messagePromises = formData.selectedUsers.map(userId => {
        const messageData: CreateMessage = {
          toUserId: userId,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          messageType: formData.messageType
        };
        return adminUserService.sendMessage(messageData);
      });

      await Promise.all(messagePromises);
      onMessagesSent();
      handleClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      message: '',
      messageType: 'General',
      priority: 'Normal',
      selectedUsers: [],
      filterByDepartment: '',
      filterByRole: '',
      filterByStatus: 'all'
    });
    setErrors({});
    setApiError(null);
    onClose();
  };

  const getMessageTypeChip = (type: string) => {
    const messageType = messageTypes.find(mt => mt.value === type);
    return (
      <Chip
        label={messageType?.label || type}
        color={messageType?.color as any || 'default'}
        size="small"
        icon={<CategoryIcon />}
      />
    );
  };

  const getPriorityChip = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return (
      <Chip
        label={priorityObj?.label || priority}
        size="small"
        icon={<PriorityIcon />}
        sx={{
          backgroundColor: priorityObj?.color || '#2196f3',
          color: 'white',
          fontWeight: 'bold'
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            <GroupIcon sx={{ mr: 1, color: greenAdminTheme.palette.primary.main }} />
            <Typography variant="h5" component="div">
              Send Bulk Message
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Message Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Message Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.messageType}>
                    <InputLabel>Message Type</InputLabel>
                    <Select
                      value={formData.messageType}
                      label="Message Type"
                      onChange={(e) => handleInputChange('messageType', e.target.value)}
                    >
                      {messageTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {getMessageTypeChip(type.value)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.messageType && <FormHelperText>{errors.messageType}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority.value} value={priority.value}>
                          {getPriorityChip(priority.value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                error={!!errors.subject}
                helperText={errors.subject || `${formData.subject.length}/200 characters`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                required
                inputProps={{ maxLength: 200 }}
              />

              <TextField
                fullWidth
                label="Message"
                multiline
                rows={8}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                error={!!errors.message}
                helperText={errors.message || `${formData.message.length}/2000 characters`}
                placeholder="Type your message here..."
                required
                inputProps={{ maxLength: 2000 }}
              />
            </Stack>
          </Grid>

          {/* Recipients Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recipients ({formData.selectedUsers.length} selected)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Filters */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Filter Recipients
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={formData.filterByDepartment}
                        label="Department"
                        onChange={(e) => handleInputChange('filterByDepartment', e.target.value)}
                      >
                        <MenuItem value="">All Departments</MenuItem>
                        {departments.map(dept => (
                          <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={formData.filterByRole}
                        label="Role"
                        onChange={(e) => handleInputChange('filterByRole', e.target.value)}
                      >
                        <MenuItem value="">All Roles</MenuItem>
                        {roles.map(role => (
                          <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.filterByStatus}
                        label="Status"
                        onChange={(e) => handleInputChange('filterByStatus', e.target.value as 'all' | 'active' | 'inactive')}
                      >
                        <MenuItem value="all">All Users</MenuItem>
                        <MenuItem value="active">Active Only</MenuItem>
                        <MenuItem value="inactive">Inactive Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Selection Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} users available
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={handleSelectAll}
                  startIcon={<SelectAllIcon />}
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  onClick={handleDeselectAll}
                  color="secondary"
                >
                  Deselect All
                </Button>
              </Stack>
            </Box>

            {/* User List */}
            <Card elevation={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {filteredUsers.map((user) => (
                  <ListItem key={user.id} dense>
                    <Checkbox
                      checked={formData.selectedUsers.includes(user.id)}
                      onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                      color="primary"
                    />
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: greenAdminTheme.palette.primary.main,
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem'
                        }}
                      >
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.fullName}
                      secondary={`${user.department} • ${user.email}`}
                    />
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Card>

            {errors.selectedUsers && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.selectedUsers}
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={loading || formData.selectedUsers.length === 0 || !formData.subject.trim() || !formData.message.trim()}
        >
          {loading ? 'Sending...' : `Send to ${formData.selectedUsers.length} Users`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkMessageModal;
