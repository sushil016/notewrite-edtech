// hooks/useAuth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance, { createServerSideAxios } from '@/lib/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

// Enhanced Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; user: User }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  initialize: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      // Initialize authentication state
      initialize: async () => {
        try {
          // Check for token in both cookies and localStorage
          const token = 
            Cookies.get('token') || 
            (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

          if (!token) {
            set({ 
              isLoading: false, 
              isAuthenticated: false, 
              user: null,
              token: null 
            });
            return;
          }

          // Validate token and fetch user
          const response = await axiosInstance.get('/auth/me');
          
          if (response.data.success && response.data.user) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true, 
              isLoading: false,
              token 
            });
          } else {
            throw new Error('Failed to initialize auth');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clear authentication data
          Cookies.remove('token');
          localStorage.removeItem('token');
          set({ 
            isLoading: false, 
            isAuthenticated: false, 
            user: null,
            token: null 
          });
        }
      },

      // Set user manually
      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      // Login method
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const response = await axiosInstance.post('/auth/login', { 
            email, 
            password 
          });
          
          const { token, user } = response.data;
          
          // Store token in both cookies and localStorage
          Cookies.set('token', token, { 
            expires: 1,  // 1 day expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            token 
          });
          
          return { success: true, user };
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            token: null 
          });
          throw error;
        }
      },

      // Logout method
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Optional: Invalidate token on server
          await axiosInstance.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all authentication data
          Cookies.remove('token');
          localStorage.removeItem('token');
          sessionStorage.clear();
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            token: null 
          });
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      },

      // Check authentication status
      checkAuth: async () => {
        try {
          const token = 
            Cookies.get('token') || 
            (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
          
          if (!token) {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              token: null 
            });
            return false;
          }

          const response = await axiosInstance.get('/auth/me');
          
          if (response.data.success && response.data.user) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true, 
              isLoading: false,
              token 
            });
            return true;
          }
          
          throw new Error('Invalid auth response');
        } catch (error) {
          console.error('Auth check error:', error);
          
          // Clear authentication data
          Cookies.remove('token');
          localStorage.removeItem('token');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            token: null 
          });
          
          return false;
        }
      },

      // Optional: Token refresh method
      refreshToken: async () => {
        try {
          const response = await axiosInstance.post('/auth/refresh-token');
          const { token } = response.data;
          
          // Update token in storage
          Cookies.set('token', token, { 
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          
          set({ token });
          return token;
        } catch (error) {
          console.error('Token refresh error:', error);
          await get().logout();
          return null;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
);

// Server-side helper for getting current user
export async function getCurrentUser(cookies: any) {
  try {
    const serverAxios = createServerSideAxios(cookies);
    const response = await serverAxios.get('/auth/me');
    
    if (response.data.success) {
      return response.data.user;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}