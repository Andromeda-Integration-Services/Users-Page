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
  InputAdornment,
  Divider,
  Stack,
  FormHelperText,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  Priority as PriorityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { greenAdminTheme } from '../../theme/greenTheme';
import adminUserService, { type AdminUser, type CreateMessage, ApiError } from '../../api/adminUserService';

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  onMessageSent: () => void;
  user: AdminUser | null;
}

interface FormData {
  toUserId: string;
  subject: string;
  message: string;
  messageType: string;
  priority: string;
}

interface FormErrors {
  [key: string]: string;
}

const SendMessageModalEnhanced: React.FC<SendMessageModalProps> = ({ open, onClose, onMessageSent, user }) => {
  const [formData, setFormData] = useState<FormData>({
    toUserId: '',
    subject: '',
    message: '',
    messageType: 'General',
    priority: 'Normal'
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

  useEffect(() => {
    if (user && open) {
      setFormData(prev => ({
        ...prev,
        toUserId: user.id
      }));
      setErrors({});
      setApiError(null);
    }
  }, [user, open]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError(null);
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

    // Message type validation
    if (!formData.messageType) {
      newErrors.messageType = 'Message type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      setApiError(null);

      const messageData: CreateMessage = {
        toUserId: formData.toUserId,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        messageType: formData.messageType
      };

      await adminUserService.sendMessage(messageData);
      onMessageSent();
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
      toUserId: user?.id || '',
      subject: '',
      message: '',
      messageType: 'General',
      priority: 'Normal'
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
            <EmailIcon sx={{ mr: 1, color: greenAdminTheme.palette.primary.main }} />
            <Typography variant="h5" component="div">
              Send Message
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

        {/* Recipient Information */}
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recipient
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: greenAdminTheme.palette.primary.main,
                  width: 50,
                  height: 50,
                  mr: 2
                }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.department} • {user.employeeId}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Message Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Message Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.messageType}>
              <InputLabel>Message Type</InputLabel>
              <Select
                value={formData.messageType}
                label="Message Type"
                onChange={(e) => handleInputChange('messageType', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                }
              >
                {messageTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      {getMessageTypeChip(type.value)}
                      <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                    </Box>
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
                startAdornment={
                  <InputAdornment position="start">
                    <PriorityIcon color="action" />
                  </InputAdornment>
                }
              >
                {priorities.map(priority => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Box display="flex" alignItems="center">
                      {getPriorityChip(priority.value)}
                      <Typography sx={{ ml: 1 }}>{priority.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              error={!!errors.message}
              helperText={errors.message || `${formData.message.length}/2000 characters`}
              placeholder="Type your message here..."
              required
              inputProps={{ maxLength: 2000 }}
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
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={loading || !formData.subject.trim() || !formData.message.trim()}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendMessageModalEnhanced;
