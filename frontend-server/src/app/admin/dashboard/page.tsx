'use client';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import axiosInstance from '@/lib/axios';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.totalUsers || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.totalCourses || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">
                  ${stats?.totalRevenue || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {stats?.activeUsers || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 