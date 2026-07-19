import { apiClient } from "@/lib/api-client";

export const adminService = {
  // ── Stats ──────────────────────────────────────────────────────────────
  getStats: () => apiClient("/api/v1/admin/stats"),

  // ── Writers ────────────────────────────────────────────────────────────
  getAllWriters: () => apiClient("/api/v1/admin/writers"),
  getWriterTasks: (writerId: number) =>
    apiClient(`/api/v1/admin/writers/${writerId}/tasks`),
  approveWriter: (writerId: number) =>
    apiClient(`/api/v1/admin/writers/${writerId}/approve`, { method: "POST" }),
  rejectWriter: (writerId: number) =>
    apiClient(`/api/v1/admin/writers/${writerId}/reject`, { method: "POST" }),
  getPendingWriters: () => apiClient("/api/v1/admin/writers/pending"),

  // ── Customers ──────────────────────────────────────────────────────────
  getAllCustomers: () => apiClient("/api/v1/admin/customers"),
  getCustomerTasks: (customerId: number) =>
    apiClient(`/api/v1/admin/customers/${customerId}/tasks`),

  // ── Tasks ──────────────────────────────────────────────────────────────
  getAllTasks: (status?: string) =>
    apiClient(`/api/v1/admin/tasks${status ? `?status=${status}` : ""}`),
  getTaskDetails: (taskId: number) =>
    apiClient(`/api/v1/admin/tasks/${taskId}`),

  // ── User management ────────────────────────────────────────────────────
  suspendUser: (userId: number) =>
    apiClient(`/api/v1/admin/users/${userId}/suspend`, { method: "POST" }),
  activateUser: (userId: number) =>
    apiClient(`/api/v1/admin/users/${userId}/activate`, { method: "POST" }),
  sendEmailToUser: (userId: number, subject: string, message: string) =>
    apiClient(`/api/v1/admin/users/${userId}/email`, {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    }),

  // ── Chats ──────────────────────────────────────────────────────────────
  getAllChatSessions: () => apiClient("/api/v1/admin/chats"),
  getChatMessages: (sessionId: number) =>
    apiClient(`/api/v1/admin/chats/${sessionId}/messages`),
};
