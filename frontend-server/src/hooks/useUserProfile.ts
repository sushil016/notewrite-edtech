import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/config/api';
import { useAuth } from './useAuth';

interface UserProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  accountType: 'ADMIN' | 'STUDENT' | 'TEACHER'
  image?: string
  profile: {
    gender?: string
    dateOfBirth?: string
    about?: string
  }
}

export const useUserProfile = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserProfileData | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchUserProfile = async () => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const { data, success } = await response.json();
      
      if (!success) {
        throw new Error('Failed to fetch profile data');
      }

      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserProfile();
    }
  }, [isAuthenticated()]);

  return { 
    userData, 
    loading, 
    error, 
    refetch: fetchUserProfile 
  };
}; 