'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import { MovingButton } from '@/components/ui/moving-border';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaVideo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function CoursePreview({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { user } = useAuth();

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${params.courseId}/preview`);
      setCourse(response.data.data);
    } catch (error) {
      toast.error('Error fetching course details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  useEffect(() => {
    if (params.courseId) {
      fetchCourseDetails();
    }
  }, [params.courseId, fetchCourseDetails]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const handleEnroll = useCallback(() => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      router.push('/login');
      return;
    }
    router.push(`/courses/${params.courseId}/enroll`);
  }, [user, router, params.courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">{course.courseName}</h1>
          
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Course Description</h2>
              <p className="text-gray-300">{course.courseDescription}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">What You Will Learn</h2>
              <p className="text-gray-300">{course.whatYouWillLearn}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Instructor</h2>
              <p className="text-gray-300">
                {course.teacher?.firstName} {course.teacher?.lastName}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Category</h2>
              <p className="text-gray-300">{course.category?.name}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Price</h2>
              <p className="text-2xl font-bold text-green-400">
                {course.price > 0 ? `₹${course.price}` : 'Free'}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
            {course.sections?.map((section) => (
              <div key={section.id} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg font-medium text-white">
                    {section.sectionName} ({section.subSections.length} lectures)
                  </span>
                  {expandedSections.has(section.id) ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                
                {expandedSections.has(section.id) && (
                  <div className="p-4 space-y-3 bg-gray-900/50">
                    {section.subSections.map((subSection) => (
                      <div
                        key={subSection.id}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800"
                      >
                        <FaVideo className="text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">{subSection.title}</h3>
                          <p className="text-sm text-gray-400">{subSection.description}</p>
                          <span className="text-xs text-gray-500">Duration: {subSection.timeDuration} minutes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <MovingButton
              onClick={handleEnroll}
              className="w-full max-w-md"
            >
              {course.price > 0 ? `Enroll Now for ₹${course.price}` : 'Enroll Free'}
            </MovingButton>
          </div>
        </div>
      </div>
    </div>
  );
} 