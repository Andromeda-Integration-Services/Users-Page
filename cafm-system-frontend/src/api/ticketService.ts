import apiClient from './axiosConfig';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: number;
  priorityText: string;
  status: number;
  statusText: string;
  category: number;
  categoryText: string;
  type: number;
  typeText: string;
  imagePath?: string;
  extractedKeywords?: string;
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  closedAt?: string;
  isOverdue: boolean;
  createdByUserId: string;
  createdByUserName: string;
  createdByUserEmail: string;
  requestedByUserId: string;
  requestedByUserName: string;
  requestedByUserEmail: string;
  onBehalfOf?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToUserEmail?: string;
  attachments: TicketAttachment[];
}

export interface TicketAttachment {
  id: number;
  ticketId: number;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileSizeFormatted: string;
  uploadedAt: string;
  uploadedById: string;
  uploadedByName: string;
  isImage: boolean;
  fileIcon: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  uploadedFiles: TicketAttachment[];
  errors: string[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: number;
  type: number;
  category?: number; // Optional - will be auto-detected if not provided
  location: string;
  requestedByUserId: string;
  onBehalfOf?: string;
  imageBase64?: string;
  imageFileName?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  location?: string;
  priority?: number;
  status?: number;
  assignedToUserId?: string;
}

export interface TicketFilterOptions {
  search?: string;
  status?: number;
  category?: number;
  priority?: number;
  assignedToUserId?: string;
  createdByUserId?: string;
  requestType?: string;
  createdFrom?: string;
  createdTo?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface KeywordSuggestion {
  keyword: string;
  category: number;
  categoryText: string;
  relevance: number;
}

export interface TicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  closedTickets: number;
  criticalTickets: number;
  ticketsByCategory: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketTrends: Array<{
    date: string;
    created: number;
    completed: number;
    inProgress: number;
  }>;
}

export interface DepartmentStats {
  department: string;
  totalTickets: number;
  completedTickets: number;
  avgResolutionTime: number;
  activeTickets: number;
  efficiency: number;
}

export interface LiveMetrics {
  activeUsers: number;
  ticketsCreatedToday: number;
  ticketsCompletedToday: number;
  avgResponseTime: number;
  systemLoad: number;
}

export interface TicketHistoryEntry {
  id: number;
  ticketId: number;
  ticketTitle: string;
  fromStatus: string;
  toStatus: string;
  fromUser: string;
  toUser: string;
  department: string;
  timestamp: string;
  duration: string;
  action: string;
}

const ticketService = {
  // Get all tickets with optional filtering
  getTickets: async (filters?: TicketFilterOptions): Promise<TicketListResponse> => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<TicketListResponse>(`/tickets?${queryParams}`);
    return response.data;
  },

  // Get a single ticket by ID
  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  // Create a new ticket
  createTicket: async (ticket: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', ticket);
    return response.data;
  },

  // Update an existing ticket
  updateTicket: async (id: number, ticket: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, ticket);
    return response.data;
  },

  // Get keyword suggestions based on input text
  getKeywordSuggestions: async (input: string): Promise<KeywordSuggestion[]> => {
    const response = await apiClient.get<KeywordSuggestion[]>(`/tickets/suggestions?input=${encodeURIComponent(input)}`);
    return response.data;
  },

  // Get ticket statistics (for dashboard)
  getTicketStats: async (): Promise<TicketStats> => {
    const response = await apiClient.get<TicketStats>('/tickets/stats');
    return response.data;
  },

  // Get department statistics
  getDepartmentStats: async (): Promise<DepartmentStats[]> => {
    const response = await apiClient.get<DepartmentStats[]>('/tickets/department-stats');
    return response.data;
  },

  // Get live metrics
  getLiveMetrics: async (): Promise<LiveMetrics> => {
    const response = await apiClient.get<LiveMetrics>('/tickets/live-metrics');
    return response.data;
  },

  // Get ticket activity history
  getActivityHistory: async (limit: number = 20): Promise<TicketHistoryEntry[]> => {
    const response = await apiClient.get<TicketHistoryEntry[]>(`/tickets/activity-history?limit=${limit}`);
    return response.data;
  },

  // Get next available ticket ID
  getNextTicketId: async (): Promise<{ nextId: number }> => {
    const response = await apiClient.get<{ nextId: number }>('/tickets/next-id');
    return response.data;
  },

  // File upload functions
  uploadFiles: async (ticketId: number, files: File[]): Promise<FileUploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post(`/files/upload/${ticketId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadFile: async (attachmentId: number): Promise<Blob> => {
    const response = await apiClient.get(`/files/download/${attachmentId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteFile: async (attachmentId: number): Promise<void> => {
    await apiClient.delete(`/files/${attachmentId}`);
  },

  getTicketAttachments: async (ticketId: number): Promise<TicketAttachment[]> => {
    const response = await apiClient.get(`/files/ticket/${ticketId}`);
    return response.data;
  }
};

export default ticketService;
