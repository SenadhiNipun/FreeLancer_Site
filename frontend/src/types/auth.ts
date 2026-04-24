export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  verify_password: string;
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_code: string;
  new_password: string;
  verify_password: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  roles: string[];
  user_id: number;
  email: string;
}

export interface AuthResponse {
  is_error: boolean;
  message: string;
  results?: any; // Keep as any for flexibility but use casting in service
}
