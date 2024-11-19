'use client'
import { TopCoursesSection } from '@/components/courses/TopCoursesSection'
import { ListedCoursesSection } from '@/components/courses/ListedCoursesSection'
import React from 'react'

const Courses = () => {
  return (
    <div className='flex flex-col gap-10 pt-20'>
      <TopCoursesSection />
      <ListedCoursesSection />
    </div>
  )
}

export default Courses
