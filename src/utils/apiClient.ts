/**
 * API Client Utility
 * Handles all API requests with authentication, error handling, and retries
 */

import { useAuthStore } from '../store/XStore';
import { getAuthHeader } from '../config/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  constructor(baseURL: string = 'http://localhost:5000/api', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.maxRetries = 3;
  }

  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    retries: number = 0
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle token refresh on 401
      if (response.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        throw {
          status: 401,
          message: 'Unauthorized. Please login again.',
        } as ApiError;
      }

      // Retry on 5xx errors
      if (response.status >= 500 && retries < this.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
        return this.fetchWithTimeout(url, options, retries + 1);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timeout',
        } as ApiError;
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    const headers = {
      ...getAuthHeader(token || undefined),
      ...options.headers,
    };

    try {
      const response = await this.fetchWithTimeout(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || data.message || 'An error occurred',
          errors: data.errors,
        } as ApiError;
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      }

      if (error && typeof error === 'object' && 'status' in error) {
        return {
          success: false,
          error: (error as ApiError).message,
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiClient = new ApiClient();
