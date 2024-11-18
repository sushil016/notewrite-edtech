import { AccountType } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        accountType: AccountType;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: AccountType;
  };
}

export {}; 