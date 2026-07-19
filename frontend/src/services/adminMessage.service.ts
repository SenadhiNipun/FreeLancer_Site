import { apiClient } from "@/lib/api-client";

export const adminMessageService = {
  // ── Admin side ────────────────────────────────────────────────────────────
  startConversation: (targetUserId: number, subject: string, message: string) =>
    apiClient("/api/v1/admin-messages/admin/start", {
      method: "POST",
      body: JSON.stringify({ target_user_id: targetUserId, subject, message }),
    }),

  getOrCreateConversationForUser: (userId: number) =>
    apiClient(`/api/v1/admin-messages/admin/by-user/${userId}`, { method: "POST" }),

  getAllConversations: () => apiClient("/api/v1/admin-messages/admin"),

  getConversation: (conversationId: number) =>
    apiClient(`/api/v1/admin-messages/admin/${conversationId}`),

  replyAsAdmin: (conversationId: number, message: string) =>
    apiClient(`/api/v1/admin-messages/admin/${conversationId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  // ── Customer / Writer side ──────────────────────────────────────────────────
  getMyConversations: () => apiClient("/api/v1/admin-messages/mine"),

  getMyConversation: (conversationId: number) =>
    apiClient(`/api/v1/admin-messages/mine/${conversationId}`),

  replyAsUser: (conversationId: number, message: string) =>
    apiClient(`/api/v1/admin-messages/mine/${conversationId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
