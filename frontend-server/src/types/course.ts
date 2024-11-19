export type AccountType = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  status: 'DRAFT' | 'PUBLISHED';
  price: number;
  tag: string[];
  instructions: string[];
  teacher?: {
    firstName: string;
    lastName: string;
    accountType: AccountType;
  };
  category?: {
    id: string;
    name: string;
  };
  students?: any[];
}
