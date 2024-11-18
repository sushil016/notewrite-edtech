import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { AccountType } from '@prisma/client';

// Define proper user type
interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
}

// Extend Request type with proper typing
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    // Check both Authorization header and cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          accountType: true,
        }
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      res.status(401).json({
        success: false,
        message: 'Invalid token format or signature.'
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const isTeacher: RequestHandler = (req, res, next) => {
  if (req.user?.accountType !== AccountType.TEACHER) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Teachers only.'
    });
    return;
  }
  next();
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.accountType !== AccountType.ADMIN) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
    return;
  }
  next();
};

export const isStudent: RequestHandler = (req, res, next) => {
  if (req.user?.accountType !== AccountType.STUDENT) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Students only.'
    });
    return;
  }
  next();
};
  