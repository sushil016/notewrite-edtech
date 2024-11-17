// src/lib/auth.ts - Create this new file
// We'll keep this file for type definitions only
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'ADMIN' | 'STUDENT' | 'TEACHER';
}