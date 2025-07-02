import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AdminUsersPageMUI from '../pages/AdminUsersPageMUI';
import UserDetailModalMUI from '../components/admin/UserDetailModalMUI';
import EditUserModalMUI from '../components/admin/EditUserModalMUI';
import SendMessageModalEnhanced from '../components/admin/SendMessageModalEnhanced';
import BulkMessageModal from '../components/admin/BulkMessageModal';
import { greenAdminTheme } from '../theme/greenTheme';
import { AuthProvider } from '../context/AuthContext';
import adminUserService from '../api/adminUserService';

// Mock the admin user service
jest.mock('../api/adminUserService');
const mockAdminUserService = adminUserService as jest.Mocked<typeof adminUserService>;

// Mock auth context
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

// Mock user data
const mockUser = {
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
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={greenAdminTheme}>
      <AuthProvider value={mockAuthContext}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('User Management Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Detail Modal Integration', () => {
    test('displays user information correctly', async () => {
      mockAdminUserService.getUserLoginHistory.mockResolvedValue([]);
      mockAdminUserService.getUserActivity.mockResolvedValue([]);
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

      render(
        <TestWrapper>
          <UserDetailModalMUI
            open={true}
            onClose={jest.fn()}
            user={mockUser}
          />
        </TestWrapper>
      );

      expect(screen.getByText('User Details')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@test.com')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
    });

    test('loads and displays user statistics', async () => {
      mockAdminUserService.getUserLoginHistory.mockResolvedValue([]);
      mockAdminUserService.getUserActivity.mockResolvedValue([]);
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

      render(
        <TestWrapper>
          <UserDetailModalMUI
            open={true}
            onClose={jest.fn()}
            user={mockUser}
          />
        </TestWrapper>
      );

      // Click on Statistics tab
      const statisticsTab = screen.getByText('Statistics');
      fireEvent.click(statisticsTab);

      await waitFor(() => {
        expect(screen.getByText('25')).toBeInTheDocument(); // Tickets Created
        expect(screen.getByText('45')).toBeInTheDocument(); // Tickets Assigned
        expect(screen.getByText('40')).toBeInTheDocument(); // Tickets Completed
      });
    });
  });

  describe('Edit User Modal Integration', () => {
    test('pre-fills form with user data', () => {
      render(
        <TestWrapper>
          <EditUserModalMUI
            open={true}
            onClose={jest.fn()}
            onUserUpdated={jest.fn()}
            user={mockUser}
          />
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('EMP001')).toBeInTheDocument();
    });

    test('submits updated user data', async () => {
      mockAdminUserService.updateUser.mockResolvedValue({
        ...mockUser,
        firstName: 'Johnny'
      });

      const onUserUpdated = jest.fn();

      render(
        <TestWrapper>
          <EditUserModalMUI
            open={true}
            onClose={jest.fn()}
            onUserUpdated={onUserUpdated}
            user={mockUser}
          />
        </TestWrapper>
      );

      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Johnny' } });

      const saveButton = screen.getByText('Update User');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockAdminUserService.updateUser).toHaveBeenCalledWith('1', expect.objectContaining({
          firstName: 'Johnny'
        }));
        expect(onUserUpdated).toHaveBeenCalled();
      });
    });
  });

  describe('Send Message Modal Integration', () => {
    test('displays recipient information', () => {
      render(
        <TestWrapper>
          <SendMessageModalEnhanced
            open={true}
            onClose={jest.fn()}
            onMessageSent={jest.fn()}
            user={mockUser}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Send Message')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@test.com')).toBeInTheDocument();
    });

    test('sends message successfully', async () => {
      mockAdminUserService.sendMessage.mockResolvedValue({
        id: 1,
        fromUserId: 'admin-1',
        fromUserName: 'Admin User',
        toUserId: '1',
        toUserName: 'John Doe',
        subject: 'Test Subject',
        message: 'Test Message',
        createdAt: '2024-06-19T12:00:00Z',
        isRead: false,
        messageType: 'General'
      });

      const onMessageSent = jest.fn();

      render(
        <TestWrapper>
          <SendMessageModalEnhanced
            open={true}
            onClose={jest.fn()}
            onMessageSent={onMessageSent}
            user={mockUser}
          />
        </TestWrapper>
      );

      const subjectInput = screen.getByLabelText('Subject');
      fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

      const messageInput = screen.getByLabelText('Message');
      fireEvent.change(messageInput, { target: { value: 'Test Message' } });

      const sendButton = screen.getByText('Send Message');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockAdminUserService.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
          toUserId: '1',
          subject: 'Test Subject',
          message: 'Test Message'
        }));
        expect(onMessageSent).toHaveBeenCalled();
      });
    });
  });

  describe('Bulk Message Modal Integration', () => {
    const mockUsers = [mockUser, {
      ...mockUser,
      id: '2',
      email: 'jane.smith@test.com',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      department: 'Plumbing'
    }];

    test('displays user list for selection', () => {
      render(
        <TestWrapper>
          <BulkMessageModal
            open={true}
            onClose={jest.fn()}
            onMessagesSent={jest.fn()}
            users={mockUsers}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Send Bulk Message')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('filters users by department', () => {
      render(
        <TestWrapper>
          <BulkMessageModal
            open={true}
            onClose={jest.fn()}
            onMessagesSent={jest.fn()}
            users={mockUsers}
          />
        </TestWrapper>
      );

      const departmentSelect = screen.getByLabelText('Department');
      fireEvent.mouseDown(departmentSelect);
      
      const itOption = screen.getByText('IT');
      fireEvent.click(itOption);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    test('sends bulk messages to selected users', async () => {
      mockAdminUserService.sendMessage.mockResolvedValue({
        id: 1,
        fromUserId: 'admin-1',
        fromUserName: 'Admin User',
        toUserId: '1',
        toUserName: 'John Doe',
        subject: 'Bulk Message',
        message: 'This is a bulk message',
        createdAt: '2024-06-19T12:00:00Z',
        isRead: false,
        messageType: 'General'
      });

      const onMessagesSent = jest.fn();

      render(
        <TestWrapper>
          <BulkMessageModal
            open={true}
            onClose={jest.fn()}
            onMessagesSent={onMessagesSent}
            users={mockUsers}
          />
        </TestWrapper>
      );

      // Select all users
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);

      // Fill in message details
      const subjectInput = screen.getByLabelText('Subject');
      fireEvent.change(subjectInput, { target: { value: 'Bulk Message' } });

      const messageInput = screen.getByLabelText('Message');
      fireEvent.change(messageInput, { target: { value: 'This is a bulk message' } });

      const sendButton = screen.getByText(/Send to \d+ Users/);
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockAdminUserService.sendMessage).toHaveBeenCalledTimes(2);
        expect(onMessagesSent).toHaveBeenCalled();
      });
    });
  });

  describe('Theme Integration', () => {
    test('applies green theme correctly', () => {
      render(
        <TestWrapper>
          <AdminUsersPageMUI />
        </TestWrapper>
      );

      // Check if the theme is applied by looking for green-themed elements
      const title = screen.getByText('User Management');
      expect(title).toHaveStyle({ color: expect.stringContaining('#388e3c') });
    });
  });

  describe('Error Handling Integration', () => {
    test('displays error messages from API failures', async () => {
      mockAdminUserService.getAllUsers.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AdminUsersPageMUI />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    test('handles validation errors in forms', async () => {
      render(
        <TestWrapper>
          <EditUserModalMUI
            open={true}
            onClose={jest.fn()}
            onUserUpdated={jest.fn()}
            user={mockUser}
          />
        </TestWrapper>
      );

      // Clear required field
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: '' } });

      const saveButton = screen.getByText('Update User');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });
  });
});
