export interface Instructor {
    name: string;
    photo: string;
  }
  
  export interface Course {
    id: number;
    title: string;
    description: string;
    instructor: Instructor;
    rating: number;
    enrolledStudents: number;
    thumbnail: string;
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    category: string;
  }
  