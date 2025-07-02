import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  InputAdornment,
  Divider,
  Stack,
  OutlinedInput,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { greenAdminTheme } from '../../theme/greenTheme';
import adminUserService, { type AdminUser, type UpdateUser, ApiError } from '../../api/adminUserService';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: AdminUser | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  department: string;
  employeeId: string;
  roles: string[];
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const EditUserModalMUI: React.FC<EditUserModalProps> = ({ open, onClose, onUserUpdated, user }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    department: '',
    employeeId: '',
    roles: [],
    isActive: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Available options
  const departments = ['Administration', 'IT', 'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Maintenance', 'Facilities', 'General'];
  const availableRoles = ['Admin', 'Manager', 'Engineer', 'Plumber', 'Electrician', 'Cleaner', 'HVACTechnician', 'SecurityPersonnel', 'ITSupport', 'EndUser'];

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        employeeId: user.employeeId,
        roles: user.roles,
        isActive: user.isActive
      });
      setErrors({});
      setApiError(null);
    }
  }, [user, open]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError(null);
  };

  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleInputChange('roles', typeof value === 'string' ? value.split(',') : value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Employee ID validation
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    // Roles validation
    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      setApiError(null);

      const userData: UpdateUser = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        department: formData.department,
        employeeId: formData.employeeId.trim(),
        roles: formData.roles,
        isActive: formData.isActive
      };

      await adminUserService.updateUser(user.id, userData);
      onUserUpdated();
      handleClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
        if (error.errors) {
          const fieldErrors: FormErrors = {};
          error.errors.forEach(err => {
            if (err.toLowerCase().includes('employee')) {
              fieldErrors.employeeId = err;
            } else if (err.toLowerCase().includes('name')) {
              fieldErrors.firstName = err;
            }
          });
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setApiError(null);
    onClose();
  };

  const getRoleChips = () => {
    return formData.roles.map(role => (
      <Chip
        key={role}
        label={role}
        onDelete={() => {
          const newRoles = formData.roles.filter(r => r !== role);
          handleInputChange('roles', newRoles);
        }}
        size="small"
        color="primary"
        sx={{ margin: '2px' }}
      />
    ));
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <EditIcon sx={{ mr: 1, color: greenAdminTheme.palette.primary.main }} />
            <Typography variant="h5" component="div">
              Edit User: {user.fullName}
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
          {/* User Information Display */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email: {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          {/* Work Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Work Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              error={!!errors.employeeId}
              helperText={errors.employeeId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => handleInputChange('department', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                }
              >
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
              {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Roles and Permissions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Roles and Permissions
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.roles}>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={formData.roles}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getRoleChips()}
                  </Box>
                )}
              >
                {availableRoles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
              {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2">
                    Account Status: {formData.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.isActive 
                      ? 'User can log in and access the system' 
                      : 'User cannot log in or access the system'
                    }
                  </Typography>
                </Box>
              }
            />
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
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModalMUI;
