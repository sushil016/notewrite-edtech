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
      title: "Python for Beginners",
      description: "Start your programming journey with Python, perfect for newcomers to coding.",
      thumbnail: "",
      duration: "4 weeks",
      instructor: { name: "John Doe", photo: "" },
      rating: 4.5,
      enrolledStudents: 1000,
      difficulty: "Beginner",
      price: 49.99,
      category: "Programming"
    },
    {
      id: "2",
      title: "Advanced JavaScript Techniques",
      description: "Take your JavaScript skills to the next level with advanced concepts and patterns.",
      thumbnail: "",
      duration: "6 weeks",
      instructor: { name: "Jane Smith", photo: "" },
      rating: 4.7,
      enrolledStudents: 800,
      difficulty: "Advanced",
      price: 79.99,
      category: "Web Development"
    },
    {
      id: "3",
      title: "Data Visualization with D3.js",
      description: "Learn to create stunning data visualizations using D3.js library.",
      thumbnail: "",
      duration: "5 weeks",
      instructor: { name: "Alex Johnson", photo: "" },
      rating: 4.6,
      enrolledStudents: 600,
      difficulty: "Intermediate",
      price: 69.99,
      category: "Data Science"
    },
    {
      id: "4",
      title: "Machine Learning Fundamentals",
      description: "Explore the core concepts of machine learning and build your first ML models.",
      thumbnail: "",
      duration: "8 weeks",
      instructor: { name: "Emily Chen", photo: "" },
      rating: 4.8,
      enrolledStudents: 750,
      difficulty: "Intermediate",
      price: 89.99,
      category: "Data Science"
    },
    {
      id: "5",
      title: "React Native for Mobile Development",
      description: "Build cross-platform mobile apps using React Native framework.",
      thumbnail: "",
      duration: "7 weeks",
      instructor: { name: "Mike Wilson", photo: "" },
      rating: 4.5,
      enrolledStudents: 550,
      difficulty: "Intermediate",
      price: 74.99,
      category: "Mobile Development"
    },
    {
      id: "6",
      title: "UI/UX Design Principles",
      description: "Master the fundamentals of user interface and user experience design.",
      thumbnail: "",
      duration: "6 weeks",
      instructor: { name: "Sarah Lee", photo: "" },
      rating: 4.9,
      enrolledStudents: 900,
      difficulty: "Beginner",
      price: 59.99,
      category: "Design"
    },
  ]
  
  export const categories = ["All", "Programming", "Web Development", "Data Science", "Mobile Development", "Design"]

