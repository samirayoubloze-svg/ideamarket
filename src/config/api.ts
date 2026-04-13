/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    ME: `${API_BASE_URL}/auth/me`,
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    GET: (id: string) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    PROFILE: `${API_BASE_URL}/users/profile/me`,
  },

  // Ideas
  IDEAS: {
    LIST: `${API_BASE_URL}/ideas`,
    CREATE: `${API_BASE_URL}/ideas`,
    GET: (id: string) => `${API_BASE_URL}/ideas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/ideas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/ideas/${id}`,
    SEARCH: `${API_BASE_URL}/ideas/search`,
    TRENDING: `${API_BASE_URL}/ideas/trending`,
    BY_CATEGORY: (category: string) => `${API_BASE_URL}/ideas/category/${category}`,
    MY_IDEAS: `${API_BASE_URL}/ideas/my-ideas`,
  },

  // Purchases
  PURCHASES: {
    LIST: `${API_BASE_URL}/purchases`,
    CREATE: `${API_BASE_URL}/purchases`,
    HISTORY: `${API_BASE_URL}/purchases/history`,
    GET: (id: string) => `${API_BASE_URL}/purchases/${id}`,
  },

  // Payments (Stripe)
  PAYMENTS: {
    CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
    CONFIRM: `${API_BASE_URL}/payments/confirm`,
    WEBHOOK: `${API_BASE_URL}/payments/webhook`,
  },

  // Reviews & Comments
  REVIEWS: {
    LIST: (ideaId: string) => `${API_BASE_URL}/ideas/${ideaId}/reviews`,
    CREATE: (ideaId: string) => `${API_BASE_URL}/ideas/${ideaId}/reviews`,
    UPDATE: (ideaId: string, reviewId: string) =>
      `${API_BASE_URL}/ideas/${ideaId}/reviews/${reviewId}`,
    DELETE: (ideaId: string, reviewId: string) =>
      `${API_BASE_URL}/ideas/${ideaId}/reviews/${reviewId}`,
  },

  // Analytics
  ANALYTICS: {
    IDEAS_STATS: `${API_BASE_URL}/analytics/ideas`,
    SALES_STATS: `${API_BASE_URL}/analytics/sales`,
    USER_STATS: `${API_BASE_URL}/analytics/users`,
  },

  // Admin
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    IDEAS: `${API_BASE_URL}/admin/ideas`,
    REPORTS: `${API_BASE_URL}/admin/reports`,
    STATISTICS: `${API_BASE_URL}/admin/statistics`,
  },
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

export const getAuthHeader = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});
