import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/api';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://notewrite-pnr1tra3.b4a.run',
  withCredentials: true,  // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Clear authentication data
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('Response:', {
//       url: response.config.url,
//       status: response.status,
//       data: response.data
//     });
//     return response;
//   },
//   (error) => {
//     console.error('Response Error:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 401) {
//       Cookies.remove('token');
//       localStorage.removeItem('token');
//       sessionStorage.clear();
      
//       const currentPath = window.location.pathname;
//       const publicPaths = ['/', '/login', '/signup', '/verify-otp', '/forgot-password'];
//       if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/courses/')) {
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject({
//       ...error,
//       friendlyMessage: error.response?.data?.message || 'An error occurred'
//     });
//   }
// );

export const createServerSideAxios = (cookies: any) => {
  const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      ...(cookies ? { 'Cookie': `token=${cookies.token}` } : {})
    },
  });

  return serverAxios;
};

export default axiosInstance; 