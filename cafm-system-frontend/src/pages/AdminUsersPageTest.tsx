import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  ThemeProvider
} from '@mui/material';
import { greenAdminTheme } from '../theme/greenTheme';
// import MainLayout from '../components/layout/MainLayout'; // Temporarily removed to test
import { useAuth } from '../context/AuthContext';

const AdminUsersPageTest: React.FC = () => {
  const { hasRole } = useAuth();

  // Access denied check
  if (!hasRole('Admin')) {
    return (
      <ThemeProvider theme={greenAdminTheme}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" color="error">
              Access Denied
            </Typography>
            <Typography variant="body1">
              Admin role required to view this page.
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={greenAdminTheme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              User Management - Test Page
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              This is a test version to verify the page loads correctly.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Test Button
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Theme Test
              </Typography>
              <Typography variant="body1">
                Primary Color: {greenAdminTheme.palette.primary.main}
              </Typography>
              <Typography variant="body1">
                Secondary Color: {greenAdminTheme.palette.secondary.main}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Authentication Test
              </Typography>
              <Typography variant="body1">
                Has Admin Role: {hasRole('Admin') ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    );
};

export default AdminUsersPageTest;
