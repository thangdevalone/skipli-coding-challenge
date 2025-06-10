import { Role } from '@/types/app';
import api from './api';

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
  name?: string;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface LoginCredentials {
  email?: string;
  phoneNumber?: string;
  accessCode: string;
  role: Role;
}

class AuthService {
  async sendVerificationCode(data: { phone?: string, email?: string }, role: Role): Promise<{ success: boolean; message: string }> {
    try {
      let response;
      if (role === Role.OWNER) {
        response = await api.post('/owner/create-access-code', { phoneNumber: data.phone });
      } else {
        response = await api.post('/employee/login-email', { email: data.email });
      }
      return { success: true, message: response.data.message };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send verification code');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      let response;
      if (credentials.role === Role.OWNER) {
        response = await api.post('/owner/validate-access-code', {
          phoneNumber: credentials.phoneNumber,
          accessCode: credentials.accessCode
        });
        return response.data;
      } else {
        response = await api.post('/employee/validate-access-code', {
          email: credentials.email,
          accessCode: credentials.accessCode
        });
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }
}

export const authService = new AuthService(); 