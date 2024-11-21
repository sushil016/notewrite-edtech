// context/AuthContext.tsx
'use client';

import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

// User interface matching your specification
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'ADMIN' | 'STUDENT' | 'TEACHER';
}

// Authentication Context Interface
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userData: AuthUser, token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<AuthUser>) => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  loading: true,
  updateUser: () => {}
});

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for token and user data in localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          
          // Validate token with backend (recommended)
          // const response = await axios.get('/validate-token');
          // if (response.data.valid) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Set default Authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login method
  const login = async (userData: AuthUser, token: string) => {
    try {
      // Store user data and token
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Route based on account type
      switch (userData.accountType) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'TEACHER':
          router.push('/teacher/dashboard');
          break;
        case 'STUDENT':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout method
  const logout = () => {
    try {
      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove Authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user method (partial update)
  const updateUser = (userData: Partial<AuthUser>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  // Prevent rendering children during initial loading
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        loading,
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}