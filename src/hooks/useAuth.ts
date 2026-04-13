/**
 * useAuth Hook
 * Custom hook for authentication logic
 */

import { useState } from 'react';
import { useAuthStore } from '../store/XStore';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const useAuth = () => {
  const { user, token, login, logout, register, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      if (!response.success) {
        const errorMsg = response.error || 'Login failed';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const { user: userData, token: authToken } = response.data as any;
      login(userData, authToken);

      return { success: true, message: 'Login successful' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      return { success: false, message: errorMsg, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (credentials.password !== credentials.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      const { confirmPassword, ...registerData } = credentials;
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, registerData);

      if (!response.success) {
        const errorMsg = response.error || 'Registration failed';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const { user: userData, token: authToken } = response.data as any;
      register(userData, authToken);

      return { success: true, message: 'Registration successful' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMsg);
      return { success: false, message: errorMsg, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): AuthResponse => {
    try {
      logout();
      return { success: true, message: 'Logged out successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      return { success: false, message: errorMsg };
    }
  };

  const updateProfile = async (userData: Partial<any>): Promise<AuthResponse> => {
    if (!user) {
      return { success: false, message: 'No user logged in' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(user.id), userData);

      if (!response.success) {
        const errorMsg = response.error || 'Update failed';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const updatedUser = response.data as any;
      updateUser(updatedUser);

      return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Update failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,
    handleLogin,
    handleRegister,
    handleLogout,
    updateProfile,
  };
};
