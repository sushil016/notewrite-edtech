'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { MovingButton } from '@/components/ui/moving-border';
import { toast } from 'sonner';

interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  teacher: {
    firstName: string;
    lastName: string;
  };
}

const categoryDescriptions = {
  'college-works': {
    title: 'College Works',
    description: 'Access comprehensive study materials, assignments, and resources for engineering courses.',
  },
  'web-development': {
    title: 'Web Development',
    description: 'Learn modern web development technologies and frameworks from industry experts.',
  },
  'mobile-development': {
    title: 'Mobile Development',
    description: 'Master mobile app development for iOS and Android platforms.',
  },
  'ai-machine-learning': {
    title: 'AI & Machine Learning',
    description: 'Explore artificial intelligence and machine learning concepts with practical applications.',
  },
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const category = categoryDescriptions[params.category as keyof typeof categoryDescriptions];

  useEffect(() => {
    fetchCourses();
  }, [params.category]);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get(`/courses/category/${params.category}`);
      setCourses(response.data.data);
    } catch (error) {
      toast.error('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{category.title}</h1>
          <p className="text-xl text-gray-400">{category.description}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {course.courseName}
                </h3>
                <p className="text-gray-400 mb-4">{course.courseDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    By {course.teacher.firstName} {course.teacher.lastName}
                  </span>
                  <span className="text-green-400 font-bold">
                    ₹{course.price}
                  </span>
                </div>
                <MovingButton
                  onClick={() => router.push(`/courses/${course.id}/preview`)}
                  className="w-full mt-4"
                >
                  View Course
                </MovingButton>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-3 text-center text-gray-400">
                <p>No courses available in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 