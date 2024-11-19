import { FC } from 'react';
import { Course } from '@/types/course';
import { MovingButton } from '../ui/moving-border';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string, price: number) => Promise<void>;
}

export const CourseCard: FC<CourseCardProps> = ({ course, onEnroll }) => {
  const { user } = useAuth();

  const handleEnrollClick = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    if (onEnroll) {
      await onEnroll(course.id, course.price);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-2">{course.courseName}</h3>
      <p className="text-gray-300 mb-4 line-clamp-2">{course.courseDescription}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">
          By {course.teacher?.firstName} {course.teacher?.lastName}
        </span>
        <span className="text-sm text-gray-400">
          {course.category?.name}
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-green-400">
          {course.price > 0 ? `₹${course.price}` : 'Free'}
        </span>
      </div>

      {onEnroll && (
        <MovingButton
          onClick={handleEnrollClick}
          className="w-full"
        >
          {course.price > 0 ? `Enroll for ₹${course.price}` : 'Enroll Free'}
        </MovingButton>
      )}
    </div>
  );
};