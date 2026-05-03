import { apiClient } from "@/lib/api-client";

export const taskService = {
  // ── Customer Endpoints ──
  getCustomerTasks: async () => {
    return apiClient('/api/v1/customer/tasks');
  },
  
  getDashboardStats: async () => {
    return apiClient('/api/v1/customer/dashboard-stats');
  },
  
  getTaskDetails: async (taskId: number) => {
    return apiClient(`/api/v1/customer/tasks/${taskId}`);
  },
  
  createTask: async (data: any) => {
    return apiClient('/api/v1/customer/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTaskBids: async (taskId: number) => {
    return apiClient(`/api/v1/customer/tasks/${taskId}/bids`);
  },

  acceptBid: async (taskId: number, bidId: number) => {
    return apiClient(`/api/v1/customer/tasks/${taskId}/bids/${bidId}/accept`, {
      method: 'POST',
    });
  },

  requestRevision: async (taskId: number, data: { revision_note: string }) => {
    return apiClient(`/api/v1/customer/tasks/${taskId}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  addFilesToTask: async (taskId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient(`/api/v1/customer/tasks/${taskId}/files`, {
      method: 'POST',
      body: formData,
      // Note: apiClient should handle removing Content-Type for FormData
    });
  },

  // ── Writer Endpoints ──
  getWriterTasks: async () => {
    return apiClient('/api/v1/writer/tasks');
  },

  getWriterTaskDetails: async (taskId: number) => {
    return apiClient(`/api/v1/writer/tasks/${taskId}`);
  },

  getOpenTasksForWriter: async () => {
    return apiClient('/api/v1/writer/tasks/open');
  },

  placeBid: async (taskId: number, data: { bid_amount: number; message?: string }) => {
    return apiClient(`/api/v1/writer/tasks/${taskId}/bids`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getWriterBids: async () => {
    return apiClient('/api/v1/writer/bids');
  },

  withdrawBid: async (bidId: number) => {
    return apiClient(`/api/v1/writer/bids/${bidId}`, {
      method: 'DELETE',
    });
  },

  submitTask: async (taskId: number, data: { submission_note: string; is_final: boolean }) => {
    return apiClient(`/api/v1/writer/tasks/${taskId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
