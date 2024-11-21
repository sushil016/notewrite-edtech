import { Testimonial } from "../types/testimonial";
import { Course } from '../types/course';  // Changed 'Course' to 'course'

export const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      photo: "",
      course: "Web Development Bootcamp",
      quote: "This course completely transformed my career. I went from knowing nothing about coding to landing a job as a junior developer in just 6 months!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      photo: "",
      course: "Data Science Fundamentals",
      quote: "The instructors are top-notch and the course content is incredibly comprehensive. I feel well-prepared to tackle real-world data science problems.",
      rating: 4.5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      photo: "",
      course: "UX/UI Design Masterclass",
      quote: "This course helped me transition from graphic design to UX/UI. The projects were challenging and the feedback was invaluable.",
      rating: 5
    },
    {
      id: 4,
      name: "David Kim",
      photo: "",
      course: "Machine Learning Specialization",
      quote: "Excellent course that covers both theory and practical applications. The hands-on projects really helped solidify my understanding of complex ML concepts.",
      rating: 4.5
    },
  ]
  


  export const courses: Course[] = [
    {
      id: "1",
      courseName: "Python for Beginners",
      courseDescription: "Start your programming journey with Python, perfect for newcomers to coding.",
      whatYouWillLearn: "Learn the basics of Python, including variables, data types, and control structures.",
      status: "PUBLISHED",
      price: 49.99,
      category: { id: "programming", name: "Programming" },
      tag: ["Python", "Beginner"],
      instructions: ["No special instructions required"]
    },
 
  ]
  
  export const categories = ["All"]

