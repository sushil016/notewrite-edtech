'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MovingButton } from '@/components/ui/moving-border';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaEdit, FaPlus } from 'react-icons/fa';

interface SubSection {
    id: string;
    title: string;
}

interface Section {
    id: string;
    sectionName: string;
    subSections: SubSection[];
}

interface Course {
    id: string;
    courseName: string;
    courseDescription: string;
    status: 'DRAFT' | 'PUBLISHED';
    sections: Section[];
    students: any[];
}

export default function TeacherCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/courses/teacher-courses');
            setCourses(response.data.data);
        } catch (error) {
            toast.error('Error fetching courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const continueCourseCreation = (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        if (course.sections.length === 0) {
            router.push(`/teacher/createCourse?step=2&courseId=${courseId}`);
        } else if (course.sections.some(s => s.subSections.length === 0)) {
            router.push(`/teacher/createCourse?step=3&courseId=${courseId}`);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">My Courses</h1>
                        <MovingButton onClick={() => router.push('/teacher/createCourse')}>
                            <FaPlus className="mr-2" /> Create New Course
                        </MovingButton>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Loading...</div>
                    ) : courses.length === 0 ? (
                        <div className="text-center text-gray-400">
                            <p>You haven't created any courses yet.</p>
                            <MovingButton
                                onClick={() => router.push('/teacher/createCourse')}
                                className="mt-4"
                            >
                                Create Your First Course
                            </MovingButton>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold text-white">
                                            {course.courseName}
                                        </h2>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                course.status === 'PUBLISHED'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                            }`}
                                        >
                                            {course.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 mb-4 line-clamp-2">
                                        {course.courseDescription}
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Sections:</span>
                                            <span>{course.sections.length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Students:</span>
                                            <span>{course.students.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        {(!course.sections.length || 
                                          course.sections.some(s => !s.subSections.length)) && (
                                            <MovingButton
                                                onClick={() => continueCourseCreation(course.id)}
                                                className="flex-1"
                                            >
                                                Continue Setup
                                            </MovingButton>
                                        )}
                                        <MovingButton
                                            onClick={() => router.push(`/teacher/courses/${course.id}`)}
                                            className="flex items-center justify-center"
                                        >
                                            <FaEdit className="w-5 h-5" />
                                        </MovingButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
} 