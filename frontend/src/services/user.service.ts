import { apiClient } from "@/lib/api-client";

export const userService = {
  getPublicProfile: async (userId: number) => {
    return apiClient(`/api/v1/users/${userId}/public-profile`);
  },

  getMyProfile: async () => {
    return apiClient(`/api/v1/users/me/profile`);
  },

  updateMyProfile: async (data: any) => {
    return apiClient(`/api/v1/users/me/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
