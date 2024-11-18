'use client'
import { courses } from '@/data/mockData'
import { TopCoursesSection } from '@/components/courses/TopCoursesSection'
import { ListedCoursesSection } from '@/components/courses/ListedCoursesSection'
import { categories } from '@/data/mockData'
import React from 'react'

const Courses = ( ) => {
  return (
    <div className='flex flex-col gap-10 pt-20'>
      <TopCoursesSection courses={courses} />
      <ListedCoursesSection courses={courses} categories={categories} />
    </div>
  )
}

export default Courses
