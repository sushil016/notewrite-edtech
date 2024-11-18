import React from 'react';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const courseCategories = [
  { name: 'Programming', count: 24 },
  { name: 'Web Development', count: 18 },
  { name: 'Blockchain', count: 12 },
  { name: 'Machine Learning', count: 15 },
];

const CourseCatalog = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaGraduationCap className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Explore Our Courses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {courseCategories.map((category) => (
          <div 
            key={category.name}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all"
          >
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-gray-400">{category.count} courses available</p>
          </div>
        ))}
      </div>

      <button  
      onClick={() => {
        window.location.href = '/courses';
      }}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
        View All Courses <FaArrowRight />
      </button>
    </motion.div>
  );
};

export default CourseCatalog; 