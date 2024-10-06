'use client'

import { useEffect } from 'react'
import { motion, useAnimation, AnimationControls } from 'framer-motion'
import DocumentationCard from './DocumentationCard'
import CourseCard from './CourseCard'

interface DocumentationItem {
  title: string;
  description: string;
}

interface Course {
  title: string;
  description: string;
}

const documentationItems: DocumentationItem[] = [
  { title: "Robotics Club Projects", description: "Explore our latest robotics club projects and innovations." },
  { title: "Arduino Tutorials", description: "Step-by-step guides for Arduino-based robotics projects." },
  { title: "Automation Techniques", description: "Learn about cutting-edge automation techniques in robotics." },
  { title: "Sensor Integration", description: "Discover how to integrate various sensors in your robotics projects." },
]

const courses: Course[] = [
  { title: "Intro to Robotics", description: "Learn the basics of robotics and build your first robot." },
  { title: "AI in Robotics", description: "Explore the integration of AI in modern robotics systems." },
  { title: "Arduino Programming", description: "Master Arduino programming for robotics applications." },
  { title: "Automation Projects", description: "Design and implement real-world automation projects." },
]

export default function RoboticsSection() {
  const controls: AnimationControls = useAnimation()
  const ctaControls: AnimationControls = useAnimation()

  useEffect(() => {
    controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } })

    const shakeSequence = async () => {
      await ctaControls.start({ x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } })
      setTimeout(shakeSequence, 5000)
    }

    shakeSequence()
  }, [controls, ctaControls])

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1
          className="text-5xl font-bold mb-12 text-center"
          initial={{ x: -100, opacity: 0 }}
          animate={controls}
        >
          Robotics & Innovation Lab
        </motion.h1>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {documentationItems.map((item, index) => (
              <DocumentationCard key={index} title={item.title} description={item.description} />
            ))}
          </div>
          <motion.button
            className="block mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Explore All Documentation
          </motion.button>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {courses.map((course, index) => (
              <CourseCard key={index} title={course.title} description={course.description} index={index} />
            ))}
          </div>
          <motion.button
            className="block mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={ctaControls}
          >
            Enroll Now
          </motion.button>
        </section>
      </div>
    </div>
  )
}