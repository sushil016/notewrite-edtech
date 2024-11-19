import { FC } from 'react';
import { Course } from '@/types/course';
import { MovingButton } from '../ui/moving-border';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CourseCardProps {
  course: Course;
  onPreview?: (courseId: string) => void;
}

export const CourseCard: FC<CourseCardProps> = ({ course, onPreview }) => {
  const { user } = useAuth();

  const handleClick = () => {
    if (onPreview) {
      onPreview(course.id);
    }
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
      onClick={handleClick}
    >
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
    </div>
  );
};