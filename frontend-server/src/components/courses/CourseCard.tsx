import { motion } from 'framer-motion';
import { Clock, BarChart } from 'lucide-react';

import Image from 'next/image';
import { StarRating } from '../common/StarRating';
import { Course } from '@/src/types/course';



interface CourseCardProps {
  course: Course;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isExpanded, toggleExpand }) => (
  <motion.div
    className="course-card bg-zinc-950 rounded-lg shadow-md overflow-hidden"
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
  >
    <Image 
      src={course.thumbnail} 
      alt={course.title} 
      width={250}
      height={150}
      className="w-full h-40 object-cover" 
    />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-blue-300">{course.title}</h3>
      <p className="text-gray-400 mb-4">{course.description}</p>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-400">{course.duration}</span>
        </div>
        <div className="flex items-center">
          <BarChart className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-400">{course.difficulty}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <StarRating
        
        rating={course.rating} />
        <span className="text-sm text-gray-600">{course.enrolledStudents.toLocaleString()} students</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-400">${course.price.toFixed(2)}</span>
        {toggleExpand && (
          <button
            className="text-blue-400 hover:text-blue-300"
            onClick={toggleExpand}
          >
            {isExpanded ? 'Less Info' : 'More Info'}
          </button>
        )}
      </div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-gray-700 rounded-md"
        >
          <h4 className="font-semibold mb-2 text-blue-300">Course Details:</h4>
          <ul className="list-disc list-inside text-gray-300">
            <li>In-depth curriculum covering all aspects of {course.title}</li>
            <li>Hands-on projects and assignments</li>
            <li>Expert instructor support</li>
            <li>Certificate upon completion</li>
          </ul>
        </motion.div>
      )}
    </div>
  </motion.div>
);