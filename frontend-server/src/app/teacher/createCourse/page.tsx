'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CreateCourseForm from '@/components/courses/CreateCourseForm';

export default function CreateCoursePage() {
  return (
    <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
      <CreateCourseForm />
    </ProtectedRoute>
  );
}
