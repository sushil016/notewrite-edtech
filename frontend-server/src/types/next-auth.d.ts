import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName: string;
      lastName: string;
      accountType: 'ADMIN' | 'STUDENT' | 'TEACHER';
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'ADMIN' | 'STUDENT' | 'TEACHER';
    image?: string;
  }
} 