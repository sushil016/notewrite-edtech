import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Course } from '@/types/course';

import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CourseCard } from './CourseCard';

gsap.registerPlugin(ScrollTrigger);

interface ListedCoursesSectionProps {
  courses: Course[];
  categories: string[];
}

export const ListedCoursesSection: React.FC<ListedCoursesSectionProps> = ({ courses, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const controls = useAnimation();

  const filteredCourses = courses.filter(course => 
    (selectedCategory === "All" || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.fromTo(
        section.querySelectorAll('.course-card'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    }
  }, [filteredCourses]);

  return (
    <section ref={sectionRef} className="py-12  text-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Explore Our Documentation</h2>
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex flex-wrap justify-center">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`m-1 ${
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-zinc-700'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isExpanded={expandedCourse === course.id}
              toggleExpand={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button>Load More Courses</Button>
        </div>
      </div>
    </section>
  );
};