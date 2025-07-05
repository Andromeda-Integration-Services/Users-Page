import apiClient from './axiosConfig';

// Mock data for development/testing
const mockUsers: AdminUser[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    department: 'IT',
    employeeId: 'EMP001',
    roles: ['Admin', 'ITSupport'],
    createdAt: '2024-01-15T08:00:00Z',
    lastLoginAt: '2024-06-19T10:30:00Z',
    isActive: true,
    totalTicketsCreated: 25,
    totalTicketsAssigned: 45,
    totalTicketsCompleted: 40,
    unreadMessages: 3,
    lastActivityAt: '2024-06-19T11:15:00Z'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    department: 'Plumbing',
    employeeId: 'EMP002',
    roles: ['Manager', 'Plumber'],
    createdAt: '2024-02-01T09:00:00Z',
    lastLoginAt: '2024-06-19T09:45:00Z',
    isActive: true,
    totalTicketsCreated: 18,
    totalTicketsAssigned: 32,
    totalTicketsCompleted: 28,
    unreadMessages: 1,
    lastActivityAt: '2024-06-19T10:20:00Z'
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    fullName: 'Mike Wilson',
    department: 'Electrical',
    employeeId: 'EMP003',
    roles: ['Engineer', 'Electrician'],
    createdAt: '2024-01-20T10:00:00Z',
    lastLoginAt: '2024-06-18T16:30:00Z',
    isActive: true,
    totalTicketsCreated: 12,
    totalTicketsAssigned: 28,
    totalTicketsCompleted: 25,
    unreadMessages: 0,
    lastActivityAt: '2024-06-18T17:00:00Z'
  },
  {
    id: '4',
    email: 'sarah.johnson@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    department: 'HVAC',
    employeeId: 'EMP004',
    roles: ['HVACTechnician'],
    createdAt: '2024-03-10T11:00:00Z',
    lastLoginAt: '2024-06-19T08:15:00Z',
    isActive: true,
    totalTicketsCreated: 8,
    totalTicketsAssigned: 15,
    totalTicketsCompleted: 12,
    unreadMessages: 2,
    lastActivityAt: '2024-06-19T09:30:00Z'
  },
  {
    id: '5',
    email: 'robert.brown@company.com',
    firstName: 'Robert',
    lastName: 'Brown',
    fullName: 'Robert Brown',
    department: 'Security',
    employeeId: 'EMP005',
    roles: ['SecurityPersonnel'],
    createdAt: '2024-02-15T12:00:00Z',
    lastLoginAt: '2024-06-17T22:00:00Z',
    isActive: false,
    totalTicketsCreated: 5,
    totalTicketsAssigned: 8,
    totalTicketsCompleted: 6,
    unreadMessages: 5,
    lastActivityAt: '2024-06-17T22:30:00Z'
  }
];

const mockLoginHistory: UserLoginHistory[] = [
  {
    id: 1,
    userId: '1',
    userName: 'John Doe',
    loginTime: '2024-06-19T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    isSuccessful: true
  },
  {
    id: 2,
    userId: '1',
    userName: 'John Doe',
    loginTime: '2024-06-18T09:15:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    isSuccessful: true
  }
];

const mockUserActivity: UserActivity[] = [
  {
    userId: '1',
    userName: 'John Doe',
    activityType: 'Ticket Created',
    description: 'Created ticket #TK001 for HVAC maintenance',
    timestamp: '2024-06-19T11:15:00Z',
    relatedEntityId: 'TK001',
    relatedEntityType: 'Ticket'
  },
  {
    userId: '1',
    userName: 'John Doe',
    activityType: 'User Login',
    description: 'Logged into the system',
    timestamp: '2024-06-19T10:30:00Z'
  }
];

const mockUserStats: UserStatistics = {
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
};

// Flag to determine if we should use mock data
const USE_MOCK_DATA = false; // Set to false when backend is ready

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Enhanced error handling
export class ApiError extends Error {
  public status?: number;
  public errors?: string[];

  constructor(message: string, status?: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  employeeId: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  totalTicketsCreated: number;
  totalTicketsAssigned: number;
  totalTicketsCompleted: number;
  unreadMessages: number;
  lastActivityAt?: string;
}

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  employeeId: string;
  roles: string[];
  isActive: boolean;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  department: string;
  employeeId: string;
  roles: string[];
  isActive: boolean;
}

export interface UserLoginHistory {
  id: number;
  userId: string;
  userName: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  isSuccessful: boolean;
}

export interface UserActivity {
  userId: string;
  userName: string;
  activityType: string;
  description: string;
  timestamp: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface AdminMessage {
  id: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  messageType: string;
}

export interface CreateMessage {
  toUserId: string;
  subject: string;
  message: string;
  messageType: string;
}

export interface UserStatistics {
  userId: string;
  userName: string;
  ticketsCreated: number;
  ticketsAssigned: number;
  ticketsCompleted: number;
  completionRate: number;
  totalMessages: number;
  unreadMessages: number;
  totalLogins: number;
  lastLogin?: string;
  accountAge: number;
}

export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTickets: number;
  totalMessages: number;
  unreadMessages: number;
  todayLogins: number;
  departmentStats: Array<{ department: string; count: number }>;
}

// Enhanced API client with better error handling
const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || `HTTP ${status} Error`;
    const errors = data?.errors || [];
    throw new ApiError(message, status, errors);
  } else if (error.request) {
    // Network error
    throw new ApiError('Network error - please check your connection');
  } else {
    // Other error
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
};

// Retry mechanism for failed requests
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
};

const adminUserService = {
  // User Management CRUD
  getAllUsers: async (
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    department?: string,
    role?: string
  ): Promise<AdminUser[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredUsers = [...mockUsers];

      // Apply filters
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.fullName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.employeeId.toLowerCase().includes(term)
        );
      }

      if (department) {
        filteredUsers = filteredUsers.filter(user => user.department === department);
      }

      if (role) {
        filteredUsers = filteredUsers.filter(user => user.roles.includes(role));
      }

      // Apply pagination
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      return filteredUsers.slice(startIndex, endIndex);
    }

    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) params.append('searchTerm', searchTerm);
    if (department) params.append('department', department);
    if (role) params.append('role', role);

    const response = await apiClient.get<AdminUser[]>(`/admin/adminusers?${params}`);
    return response.data;
  },

  getAllUsersUnpaginated: async (
    searchTerm?: string,
    department?: string,
    role?: string
  ): Promise<AdminUser[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredUsers = [...mockUsers];

      // Apply filters
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.fullName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.employeeId.toLowerCase().includes(term)
        );
      }

      if (department) {
        filteredUsers = filteredUsers.filter(user => user.department === department);
      }

      if (role) {
        filteredUsers = filteredUsers.filter(user => user.roles.includes(role));
      }

      return filteredUsers;
    }

    const params = new URLSearchParams();

    if (searchTerm) params.append('searchTerm', searchTerm);
    if (department) params.append('department', department);
    if (role) params.append('role', role);

    const response = await apiClient.get<AdminUser[]>(`/admin/adminusers/all?${params}`);
    return response.data;
  },

  getUserById: async (userId: string): Promise<AdminUser> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      return user;
    }

    const response = await apiClient.get<AdminUser>(`/admin/adminusers/${userId}`);
    return response.data;
  },

  createUser: async (userData: CreateUser): Promise<AdminUser> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newUser: AdminUser = {
        id: (mockUsers.length + 1).toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        department: userData.department,
        employeeId: userData.employeeId,
        roles: userData.roles,
        createdAt: new Date().toISOString(),
        isActive: userData.isActive,
        totalTicketsCreated: 0,
        totalTicketsAssigned: 0,
        totalTicketsCompleted: 0,
        unreadMessages: 0
      };
      mockUsers.push(newUser);
      return newUser;
    }

    const response = await apiClient.post<AdminUser>('/admin/adminusers', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUser): Promise<AdminUser> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('User not found');

      const updatedUser = {
        ...mockUsers[userIndex],
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        department: userData.department,
        employeeId: userData.employeeId,
        roles: userData.roles,
        isActive: userData.isActive
      };

      mockUsers[userIndex] = updatedUser;
      return updatedUser;
    }

    const response = await apiClient.put<AdminUser>(`/admin/adminusers/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('User not found');
      mockUsers.splice(userIndex, 1);
      return;
    }

    await apiClient.delete(`/admin/adminusers/${userId}`);
  },

  toggleUserStatus: async (userId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      user.isActive = !user.isActive;
      return;
    }

    await apiClient.patch(`/admin/adminusers/${userId}/toggle-status`);
  },

  // User Activity & History
  getUserLoginHistory: async (
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<UserLoginHistory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockLoginHistory.filter(h => h.userId === userId);
    }

    const response = await apiClient.get<UserLoginHistory[]>(
      `/admin/adminusers/${userId}/login-history?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getUserActivity: async (
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<UserActivity[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockUserActivity.filter(a => a.userId === userId);
    }

    const response = await apiClient.get<UserActivity[]>(
      `/admin/adminusers/${userId}/activity?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Admin Messaging
  sendMessage: async (messageData: CreateMessage): Promise<AdminMessage> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newMessage: AdminMessage = {
        id: Date.now(),
        fromUserId: 'current-admin-id',
        fromUserName: 'Admin User',
        toUserId: messageData.toUserId,
        toUserName: mockUsers.find(u => u.id === messageData.toUserId)?.fullName || 'Unknown User',
        subject: messageData.subject,
        message: messageData.message,
        createdAt: new Date().toISOString(),
        isRead: false,
        messageType: messageData.messageType
      };

      // Update user's unread message count
      const user = mockUsers.find(u => u.id === messageData.toUserId);
      if (user) {
        user.unreadMessages += 1;
      }

      return newMessage;
    }

    const response = await apiClient.post<AdminMessage>('/admin/adminmessages', messageData);
    return response.data;
  },

  getUserMessages: async (
    unreadOnly: boolean = false,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<AdminMessage[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return []; // Return empty array for mock
    }

    const response = await apiClient.get<AdminMessage[]>(
      `/admin/adminmessages/inbox?unreadOnly=${unreadOnly}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getSentMessages: async (
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<AdminMessage[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return []; // Return empty array for mock
    }

    const response = await apiClient.get<AdminMessage[]>(
      `/admin/adminmessages/sent?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  markMessageAsRead: async (messageId: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    await apiClient.patch(`/admin/adminmessages/${messageId}/read`);
  },

  getUnreadMessageCount: async (): Promise<number> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return 5; // Mock unread count
    }

    const response = await apiClient.get<{ count: number }>('/admin/adminmessages/unread-count');
    return response.data.count;
  },

  // Statistics
  getUserStatistics: async (userId: string): Promise<UserStatistics> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      return {
        userId: user.id,
        userName: user.fullName,
        ticketsCreated: user.totalTicketsCreated,
        ticketsAssigned: user.totalTicketsAssigned,
        ticketsCompleted: user.totalTicketsCompleted,
        completionRate: user.totalTicketsAssigned > 0
          ? Math.round((user.totalTicketsCompleted / user.totalTicketsAssigned) * 100 * 10) / 10
          : 0,
        totalMessages: 15,
        unreadMessages: user.unreadMessages,
        totalLogins: Math.floor(Math.random() * 200) + 50,
        lastLogin: user.lastLoginAt,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      };
    }

    const response = await apiClient.get<UserStatistics>(`/admin/adminusers/${userId}/statistics`);
    return response.data;
  },

  getSystemStatistics: async (): Promise<SystemStatistics> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const activeUsers = mockUsers.filter(u => u.isActive).length;
      const inactiveUsers = mockUsers.filter(u => !u.isActive).length;

      return {
        totalUsers: mockUsers.length,
        activeUsers,
        inactiveUsers,
        totalTickets: 150,
        totalMessages: 75,
        unreadMessages: 12,
        todayLogins: 25,
        departmentStats: [
          { department: 'IT', count: 2 },
          { department: 'Plumbing', count: 1 },
          { department: 'Electrical', count: 1 },
          { department: 'HVAC', count: 1 },
          { department: 'Security', count: 1 }
        ]
      };
    }

    const response = await apiClient.get<SystemStatistics>('/admin/adminusers/statistics');
    return response.data;
  },
};

export default adminUserService;
