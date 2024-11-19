export type AccountType = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface SubSection {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  notesUrls: string[];
  timeDuration: string;
}

export interface Section {
  id: string;
  sectionName: string;
  subSections: SubSection[];
}

export interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  status: 'DRAFT' | 'PUBLISHED';
  price: number;
  tag: string[];
  instructions: string[];
  sections?: Section[];
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
