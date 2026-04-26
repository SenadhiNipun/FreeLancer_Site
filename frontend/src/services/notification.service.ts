import { apiClient } from "@/lib/api-client";

export const notificationService = {
  getNotifications: async (limit: number = 20) => {
    return apiClient(`/api/v1/notifications?limit=${limit}`);
  },

  markAsRead: async (notificationId: number) => {
    return apiClient(`/api/v1/notifications/${notificationId}/read`, {
      method: "POST",
    });
  },
};
