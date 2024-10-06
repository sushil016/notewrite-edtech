'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface DocumentationCardProps {
  title: string;
  description: string;
}

export default function DocumentationCard({ title, description }: DocumentationCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <motion.div
      className="bg-zinc-950 p-6 rounded-lg shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05, rotate: 2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <h3 className="text-xl font-bold mb-2 text-blue-400">{title}</h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="text-gray-300 text-sm"
      >
        {description}
      </motion.div>
    </motion.div>
  )
}