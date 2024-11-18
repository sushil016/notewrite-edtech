import React from 'react';
import { FaUsers, FaComment, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const discussions = [
  {
    title: 'Tips for Learning Data Structures',
    author: 'John Doe',
    replies: 23,
    likes: 45,
    tags: ['DSA', 'Learning'],
  },
  {
    title: 'Web Development Career Path',
    author: 'Jane Smith',
    replies: 18,
    likes: 32,
    tags: ['Career', 'WebDev'],
  },
  {
    title: 'Machine Learning Project Ideas',
    author: 'Mike Johnson',
    replies: 15,
    likes: 28,
    tags: ['ML', 'Projects'],
  },
];

const CommunityForum = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaUsers className="text-3xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Community Forum</h2>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div 
            key={discussion.title}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{discussion.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>by {discussion.author}</span>
              <div className="flex items-center gap-1">
                <FaComment className="text-blue-400" />
                <span>{discussion.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-red-400" />
                <span>{discussion.likes}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {discussion.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityForum; 