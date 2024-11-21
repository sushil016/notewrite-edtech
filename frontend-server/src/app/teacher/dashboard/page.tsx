'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MovingButton } from '@/components/ui/moving-border';
import axiosInstance from '@/lib/axios';

interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  studentsEnrolled: number;
  status: string;
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      const response = await axiosInstance.get('/courses/teacher-courses');
      console.log('Response:', response.data);
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <div className="min-h-screen p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <div className="flex gap-4">
            <MovingButton onClick={() => router.push('/teacher/createCategory')}>
                Create New Category
              </MovingButton>
              <MovingButton onClick={() => router.push('/teacher/my-courses')}>
                Edit / Review Courses
              </MovingButton>
              <MovingButton onClick={() => router.push('/teacher/createCourse')}>
                Create New Course
              </MovingButton>
           
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/teacher/courses/${course.id}/review`)}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2">{course.courseName}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {course.courseDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {course.studentsEnrolled} students enrolled
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        course.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  <p className="mb-4">You havent created any courses yet.</p>
                  <MovingButton onClick={() => router.push('/teacher/createCourse')}>
                    Create Your First Course
                  </MovingButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
