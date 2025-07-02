import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AdminUsersPageMUI from '../pages/AdminUsersPageMUI';
import { greenAdminTheme } from '../theme/greenTheme';
import { AuthProvider } from '../context/AuthContext';
import adminUserService from '../api/adminUserService';

// Mock the admin user service
jest.mock('../api/adminUserService');
const mockAdminUserService = adminUserService as jest.Mocked<typeof adminUserService>;

// Mock the auth context
const mockAuthContext = {
  user: {
    id: 'admin-1',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['Admin']
  },
  hasRole: jest.fn((role: string) => role === 'Admin'),
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true,
  loading: false
};

// Mock users data
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@test.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    department: 'IT',
    employeeId: 'EMP001',
    roles: ['Admin', 'Manager'],
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-06-19T10:30:00Z',
    isActive: true,
    totalTicketsCreated: 25,
    totalTicketsAssigned: 45,
    totalTicketsCompleted: 40,
    unreadMessages: 3,
    lastActivityAt: '2024-06-19T11:00:00Z'
  },
  {
    id: '2',
    email: 'jane.smith@test.com',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    department: 'Plumbing',
    employeeId: 'EMP002',
    roles: ['Plumber'],
    createdAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-06-18T14:20:00Z',
    isActive: true,
    totalTicketsCreated: 15,
    totalTicketsAssigned: 30,
    totalTicketsCompleted: 28,
    unreadMessages: 1,
    lastActivityAt: '2024-06-18T15:00:00Z'
  },
  {
    id: '3',
    email: 'bob.wilson@test.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    fullName: 'Bob Wilson',
    department: 'Electrical',
    employeeId: 'EMP003',
    roles: ['Electrician'],
    createdAt: '2024-02-01T00:00:00Z',
    isActive: false,
    totalTicketsCreated: 8,
    totalTicketsAssigned: 12,
    totalTicketsCompleted: 10,
    unreadMessages: 0
  }
];

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={greenAdminTheme}>
      <AuthProvider value={mockAuthContext}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('AdminUsersPageMUI', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockAdminUserService.getAllUsers.mockResolvedValue(mockUsers);
    mockAdminUserService.getUserStatistics.mockResolvedValue({
      userId: '1',
      userName: 'John Doe',
      ticketsCreated: 25,
      ticketsAssigned: 45,
      ticketsCompleted: 40,
      completionRate: 88.9,
      totalMessages: 15,
      unreadMessages: 3,
      totalLogins: 156,
      lastLogin: '2024-06-19T10:30:00Z',
      accountAge: 155
    });
  });

  test('renders user management page with correct title', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage system users, roles, and permissions')).toBeInTheDocument();
  });

  test('displays user statistics cards', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('Inactive Users')).toBeInTheDocument();
      expect(screen.getByText('Departments')).toBeInTheDocument();
    });
  });

  test('displays users in table format', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@test.com')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  test('filters users by search term', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('filters users by department', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    const departmentSelect = screen.getByLabelText('Department');
    fireEvent.mouseDown(departmentSelect);
    
    const itOption = screen.getByText('IT');
    fireEvent.click(itOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('filters users by status', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    const inactiveOption = screen.getByText('Inactive');
    fireEvent.click(inactiveOption);

    await waitFor(() => {
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('opens user detail modal when view button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const viewButtons = screen.getAllByLabelText('View Details');
      fireEvent.click(viewButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });
  });

  test('opens edit modal when edit button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText('Edit User');
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Edit User: John Doe')).toBeInTheDocument();
    });
  });

  test('opens send message modal when message button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const messageButtons = screen.getAllByLabelText('Send Message');
      fireEvent.click(messageButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  test('opens bulk message modal when bulk message button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const bulkMessageButton = screen.getByText('Bulk Message');
      fireEvent.click(bulkMessageButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Send Bulk Message')).toBeInTheDocument();
    });
  });

  test('toggles user status when toggle button is clicked', async () => {
    mockAdminUserService.toggleUserStatus.mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const toggleButtons = screen.getAllByLabelText('Deactivate');
      fireEvent.click(toggleButtons[0]);
    });

    await waitFor(() => {
      expect(mockAdminUserService.toggleUserStatus).toHaveBeenCalledWith('1');
    });
  });

  test('opens delete confirmation when delete button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Delete User');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete User')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete user/)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockAdminUserService.getAllUsers.mockRejectedValue(new Error('API Error'));
    
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('displays loading state while fetching data', () => {
    // Mock a delayed response
    mockAdminUserService.getAllUsers.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 1000))
    );

    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('refreshes data when refresh button is clicked', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const refreshButton = screen.getByLabelText('Refresh');
      fireEvent.click(refreshButton);
    });

    expect(mockAdminUserService.getAllUsers).toHaveBeenCalledTimes(2);
  });

  test('displays correct user statistics', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should show 3 total users (from mock data)
      expect(screen.getByText('3')).toBeInTheDocument();
      // Should show 2 active users
      expect(screen.getByText('2')).toBeInTheDocument();
      // Should show 1 inactive user
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    render(
      <TestWrapper>
        <AdminUsersPageMUI />
      </TestWrapper>
    );

    await waitFor(() => {
      const pagination = screen.getByText('Rows per page:');
      expect(pagination).toBeInTheDocument();
    });
  });
});
