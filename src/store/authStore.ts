import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  register: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // كنخليو القيم البدائية فارغة باش ما نضربوش مع السيرفر في الـ Build
  user: null,
  token: null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  register: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  initializeAuth: () => {
    // كدير هاد التأكد باش Vercel ما يعطيكش خطأ أثناء الـ Build
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          set({
            user: JSON.parse(storedUser),
            token: storedToken,
          });
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  },
}));