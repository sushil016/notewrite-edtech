import { useState } from 'react';
import axiosInstance from '@/lib/axios';

export const useUserProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put('/api/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}; 