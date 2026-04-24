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
    return apiClient('/api/v1/auth/register/user', {
      method: 'POST',
      body: JSON.stringify(data),
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
  
  registerWriter: async (data: any): Promise<AuthResponse> => {
    return apiClient('/api/v1/auth/register/writer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_roles");
    window.location.href = "/";
  },
};
