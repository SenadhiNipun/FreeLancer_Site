import { apiClient } from "@/lib/api-client";

export const supportService = {
  // ── Customer ────────────────────────────────────────────────────────────
  createTicket: (subject: string, message: string) =>
    apiClient("/api/v1/support/tickets", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    }),

  getMyTickets: () => apiClient("/api/v1/support/tickets"),

  getTicket: (ticketId: number) =>
    apiClient(`/api/v1/support/tickets/${ticketId}`),

  // ── Admin ────────────────────────────────────────────────────────────────
  getAllTickets: (status?: string) =>
    apiClient(`/api/v1/support/admin/tickets${status ? `?status=${status}` : ""}`),

  getAdminTicket: (ticketId: number) =>
    apiClient(`/api/v1/support/admin/tickets/${ticketId}`),

  replyToTicket: (ticketId: number, message: string) =>
    apiClient(`/api/v1/support/admin/tickets/${ticketId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  updateStatus: (ticketId: number, status: string) =>
    apiClient(`/api/v1/support/admin/tickets/${ticketId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
