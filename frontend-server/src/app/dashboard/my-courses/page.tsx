'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Course } from '@/types/course';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaPlay } from 'react-icons/fa';
import { MovingButton } from '@/components/ui/moving-border';

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses/enrolled');
      setEnrolledCourses(response.data.data);
    } catch (error) {
      toast.error('Error fetching enrolled courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const continueCourse = (courseId: string) => {
    router.push(`/dashboard/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Courses</h1>

          {enrolledCourses.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="mb-4">You haven&apos;t enrolled in any courses yet.</p>
              <MovingButton onClick={() => router.push('/courses')}>
                Browse Courses
              </MovingButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {course.courseDescription}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      By {course.teacher?.firstName} {course.teacher?.lastName}
                    </span>
                    <span className="text-sm text-gray-400">
                      {course.category?.name}
                    </span>
                  </div>

                  <MovingButton
                    onClick={() => continueCourse(course.id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FaPlay className="w-4 h-4" />
                    Continue Learning
                  </MovingButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 