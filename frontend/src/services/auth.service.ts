import { apiClient } from "@/lib/api-client";
import { 
  LoginRequest, 
  RegisterRequest, 
  VerifyEmailRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  AuthResponse 
} from "@/types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Map phone_number to mobile_number and whatsapp_number for backend compatibility
    const payload = {
      ...data,
      mobile_number: data.phone_number,
      whatsapp_number: data.phone_number,
    };
    
    return apiClient('/api/v1/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  me: async (token: string): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
  
  registerWriter: async (data: any): Promise<AuthResponse> => {
    // Ensure phone_number is mapped to mobile_number and whatsapp_number if needed
    const payload = {
      ...data,
      mobile_number: data.mobile_number || data.phone_number,
      whatsapp_number: data.whatsapp_number || data.phone_number,
    };

    return apiClient('/api/v1/auth/register/writer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_roles");
    localStorage.removeItem("user");
    window.location.href = "/";
  },
};
