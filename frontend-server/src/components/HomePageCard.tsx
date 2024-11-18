"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface DataPoint {
  name: string;
  Critical: number;
  High: number;
  Moderate: number;
  Low: number;
  [key: string]: string | number; // Index signature
}

const data: DataPoint[] = [
  { name: 'Jan', Critical: 4, High: 8, Moderate: 15, Low: 20 },
  { name: 'Feb', Critical: 3, High: 10, Moderate: 12, Low: 22 },
  { name: 'Mar', Critical: 5, High: 7, Moderate: 18, Low: 18 },
  { name: 'Apr', Critical: 2, High: 12, Moderate: 14, Low: 24 },
  { name: 'May', Critical: 6, High: 9, Moderate: 16, Low: 19 },
  { name: 'Jun', Critical: 4, High: 11, Moderate: 13, Low: 21 },
];

const tabs = [
  { id: 'code', label: 'Code' },
  { id: 'plan', label: 'Plan' },
  { id: 'collaborate', label: 'Collaborate' },
  { id: 'automate', label: 'Automate' },
  { id: 'secure', label: 'Secure' },
];

const HomePageCard = () => {
  const [activeTab, setActiveTab] = useState('code');

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
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
              {['Critical', 'High', 'Moderate', 'Low'].map((severity) => (
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
            <div className="h-72 w-full bg-gray-900/30 rounded-lg p-4 border border-gray-800">
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
            </div>

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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePageCard;
