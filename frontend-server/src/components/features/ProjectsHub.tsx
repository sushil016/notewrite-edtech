import React from 'react';
import { FaProjectDiagram, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Smart Home Automation',
    category: 'IoT',
    difficulty: 'Intermediate',
    stars: 245,
  },
  {
    title: 'Bridge Design Simulator',
    category: 'Civil',
    difficulty: 'Advanced',
    stars: 189,
  },
  {
    title: 'AI Chess Engine',
    category: 'Computer Science',
    difficulty: 'Advanced',
    stars: 312,
  },
  {
    title: 'Solar Power System',
    category: 'Electrical',
    difficulty: 'Intermediate',
    stars: 156,
  },
];

const ProjectsHub = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaProjectDiagram className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Engineering Projects</h2>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div 
            key={project.title}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-gray-400">{project.category} • {project.difficulty}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar />
                <span className="text-sm">{project.stars}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsHub; 