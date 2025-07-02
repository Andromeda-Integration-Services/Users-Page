import apiClient from './axiosConfig';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  employeeId?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenExpiry?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    department?: string;
    location?: string;
    roles: string[];
    createdAt: string;
    lastLoginAt?: string;
    isActive: boolean;
  };
}

const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<BackendAuthResponse>('/auth/login', credentials);

    if (!response.data.success || !response.data.token || !response.data.user) {
      throw new Error(response.data.message || 'Login failed');
    }

    return {
      token: response.data.token,
      userId: response.data.user.id,
      email: response.data.user.email,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      roles: response.data.user.roles
    };
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const registerData = {
      ...userData,
      confirmPassword: userData.password,
      department: userData.department || 'General',
      employeeId: userData.employeeId || '',
      role: 'EndUser' // Role will be automatically assigned based on department
    };

    const response = await apiClient.post<BackendAuthResponse>('/auth/register', registerData);

    if (!response.data.success || !response.data.token || !response.data.user) {
      throw new Error(response.data.message || 'Registration failed');
    }

    return {
      token: response.data.token,
      userId: response.data.user.id,
      email: response.data.user.email,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      roles: response.data.user.roles
    };
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
