"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCatalog from './features/CourseCatalog';
import Documentation from './features/Documentation';
import ProjectsHub from './features/ProjectsHub';
import ResourceLibrary from './features/ResourceLibrary';
import CommunityForum from './features/CommunityForum';

interface DataPoint {
  name: string;
  Courses: number;
  Documentation: number;
  Projects: number;
  Resources: number;
  [key: string]: string | number; // Index signature
}

const data: DataPoint[] = [
  { name: 'Jan', Courses: 4, Documentation: 8, Projects: 15, Resources: 20 },
  { name: 'Feb', Courses: 3, Documentation: 10, Projects: 12, Resources: 22 },
  { name: 'Mar', Courses: 5, Documentation: 7, Projects: 18, Resources: 18 },
  { name: 'Apr', Courses: 2, Documentation: 12, Projects: 14, Resources: 24 },
  { name: 'May', Courses: 6, Documentation: 9, Projects: 16, Resources: 19 },
  { name: 'Jun', Courses: 4, Documentation: 11, Projects: 13, Resources: 21 },
];

const tabs = [
  { id: 'courses', label: 'Explore Courses' },
  { id: 'documentation', label: 'Learn From Documentation' },
  { id: 'projects', label: 'Engineering Projects Hub' },
  { id: 'resources', label: 'Resource Library' },
  { id: 'community', label: 'User Community Forum' },
];

const HomePageCard = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CourseCatalog />;
      case 'documentation':
        return <Documentation />;
      case 'projects':
        return <ProjectsHub />;
      case 'resources':
        return <ResourceLibrary />;
      case 'community':
        return <CommunityForum />;
      default:
        return <CourseCatalog />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative rounded-2xl p-[15px] overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400">
            <div className="absolute inset-[2px] bg-[#0F172A] rounded-xl" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 space-y-8 p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Courses', 'Documentation', 'Projects', 'Resources'].map((severity) => (
                <div 
                  key={severity} 
                  className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                >
                  <p className="text-2xl font-bold text-blue-400">
                    {data[data.length - 1][severity]}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{severity}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            {/* <div className="h-72 w-full bg-gray-900/30 rounded-lg p-4 border border-gray-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Line 
                    type="monotone" 
                    dataKey="Critical" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="High" 
                    stroke="#F59E0B" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Moderate" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Low" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div> */}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-between items-center border-t border-gray-800 pt-6 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-400 scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePageCard;
