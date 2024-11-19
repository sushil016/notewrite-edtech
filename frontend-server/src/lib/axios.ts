import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url?.includes('/signup')) {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      console.log('Signup Request Details:', { 
        url: config.url, 
        method: config.method, 
        data: {
          ...data,
          password: data.password ? '***' : 'undefined',
          confirmPassword: data.confirmPassword ? '***' : 'undefined'
        },
        headers: config.headers,
      });
    }
    console.log('Request Details:', { 
      url: config.url, 
      method: config.method, 
      data: JSON.stringify(config.data, null, 2),
      headers: config.headers,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject({
      ...error,
      friendlyMessage: 'Failed to send request'
    });
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response Success:', { 
      url: response.config.url, 
      status: response.status, 
      data: response.data 
    });
    return response;
  },
  (error) => {
    // Enhanced error logging with request data
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      message: error.response?.data?.message || error.message,
    };
    
    console.error('API Error Details:', errorDetails);

    // Specific error handling for signup/validation errors
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes('Passwords do not match')) {
        return Promise.reject({
          ...error,
          friendlyMessage: 'Passwords do not match. Please make sure your passwords are identical.'
        });
      }
      return Promise.reject({
        ...error,
        friendlyMessage: errorMessage || 'Please check your input and try again'
      });
    }

    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject({
        ...error,
        friendlyMessage: 'Your session has expired. Please log in again.'
      });
    }

    // Network or server errors
    if (!error.response) {
      return Promise.reject({
        ...error,
        friendlyMessage: 'Unable to connect to the server. Please check your internet connection.'
      });
    }

    return Promise.reject({
      ...error,
      friendlyMessage: error.response?.data?.message || 'An unexpected error occurred. Please try again later.'
    });
  }
);

export default axiosInstance; 