import { Testimonial } from "../types/testimonial";
import { Course } from '../types/course';  // Changed 'Course' to 'course'

export const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      image: "/assets/default-avatar.png",
      rating: 5,
      comment: "Amazing platform for learning! The courses are well-structured and easy to follow."
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Professional",
      image: "/assets/default-avatar.png",
      rating: 4,
      comment: "Great resource for professional development. The content is top-notch."
    },
    // Add more testimonials as needed
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

