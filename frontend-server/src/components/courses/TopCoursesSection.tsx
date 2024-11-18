import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Course } from '@/types/course';
import { CourseCard } from './CourseCard';


interface TopCoursesSectionProps {
  courses: Course[];
}

export const TopCoursesSection: React.FC<TopCoursesSectionProps> = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add a check for courses
  if (!courses || courses.length === 0) {
    return (
      <section className="py-12 bg-zinc-950 text-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Top Courses</h2>
          <p className="text-center text-gray-600">No courses available at the moment.</p>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
  };

  return (
    <section className="py-12 bg-zinc-90 text-gray-100 z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Top Courses</h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="w-2/3 flex-shrink-0 sm:w-3/4 sm:ml-48 p-4 "
                initial={{ opacity: 0, x: '100%' }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  x: index === currentIndex ? '0%' : '100%',
                }}
                transition={{ duration: 0.5 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};