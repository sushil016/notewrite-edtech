export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  accountType: 'ADMIN' | 'STUDENT' | 'TEACHER';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
} 