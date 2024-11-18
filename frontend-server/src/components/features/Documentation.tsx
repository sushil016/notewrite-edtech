import React from 'react';
import { FaBook, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const documentationSections = [
  { title: 'Getting Started', articles: 12 },
  { title: 'API References', articles: 25 },
  { title: 'Tutorials', articles: 18 },
  { title: 'Best Practices', articles: 15 },
];

const Documentation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaBook className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Documentation</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentationSections.map((section) => (
          <div 
            key={section.title}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all"
          >
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            <p className="text-sm text-gray-400">{section.articles} articles</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Documentation; 