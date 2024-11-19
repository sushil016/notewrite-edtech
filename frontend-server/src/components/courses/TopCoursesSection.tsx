import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Course } from '@/types/course';
import { CourseCard } from './CourseCard';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export const TopCoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchRecentCourses();
  }, []);

  const fetchRecentCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/courses/recent');
      setCourses(response.data.data);
    } catch (error) {
      toast.error('Error fetching recent courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (loading) {
    return (
      <section className="py-12 bg-zinc-950 text-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Courses</h2>
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <section className="py-12 bg-zinc-950 text-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Courses</h2>
          <p className="text-center text-gray-600">No courses available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-zinc-90 text-gray-100 z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Recent Courses</h2>
        <div className="relative h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full max-w-2xl mx-auto px-4"
              >
                <CourseCard course={courses[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {courses.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-full p-3 hover:bg-white/20 transition-colors z-20"
                aria-label="Previous course"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-full p-3 hover:bg-white/20 transition-colors z-20"
                aria-label="Next course"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 z-20">
            <p className="text-white text-sm">
              {currentIndex + 1} / {courses.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};