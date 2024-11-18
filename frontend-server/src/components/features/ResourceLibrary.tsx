import React from 'react';
import { FaBookOpen, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

const resources = [
  {
    title: 'Data Structures Notes',
    type: 'Class Notes',
    downloads: 1234,
    size: '2.5 MB',
  },
  {
    title: 'Computer Networks PYQ',
    type: 'Previous Year Questions',
    downloads: 987,
    size: '1.8 MB',
  },
  {
    title: 'Digital Electronics Textbook',
    type: 'Textbook',
    downloads: 2341,
    size: '15.2 MB',
  },
  {
    title: 'DBMS Assignment Solutions',
    type: 'Assignment',
    downloads: 756,
    size: '1.2 MB',
  },
];

const ResourceLibrary = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaBookOpen className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Resource Library</h2>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.title}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                <p className="text-sm text-gray-400">{resource.type} • {resource.size}</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                <FaDownload />
                <span className="text-sm">{resource.downloads}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResourceLibrary; 