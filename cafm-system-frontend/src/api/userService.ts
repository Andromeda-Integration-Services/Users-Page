import apiClient from './axiosConfig';

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  department?: string;
  roles: string[];
}

export interface UserSuggestion {
  name: string;
  type: string; // "ServiceOfficer" or "ServiceRequestor"
  department?: string;
}

const userService = {
  // Get list of registered users for dropdown
  getRegisteredUsers: async (): Promise<RegisteredUser[]> => {
    const response = await apiClient.get<RegisteredUser[]>('/users/registered');
    return response.data;
  },

  // Search for user suggestions for autocomplete
  searchUsers: async (query: string): Promise<UserSuggestion[]> => {
    if (!query || query.length < 2) {
      return [];
    }
    const response = await apiClient.get<UserSuggestion[]>(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default userService;
