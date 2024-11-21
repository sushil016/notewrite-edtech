// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// // Extend Express Request type to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         accountType: string;
//       };
//     }
//   }
// }
// interface JwtPayload {
//   id: string;
//   email: string;
//   accountType: string;
// }
// export const authenticateUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       res.status(401).json({
//         success: false,
//         message: 'Not authorized, please login',
//       });
//       return;
//     }
//     try {
//       const secret = process.env.JWT_SECRET;
//       if (!secret) {
//         throw new Error('JWT_SECRET is not defined');
//       }
//       const decoded = jwt.verify(token, secret) as JwtPayload;
//       req.user = decoded;
//       // Verify user exists in database
//       const user = await prisma.user.findUnique({
//         where: { id: decoded.id },
//         select: {
//           id: true,
//           email: true,
//           accountType: true,
//         },
//       });
//       if (!user) {
//         throw new Error('User not found');
//       }
//       next();
//     } catch (error) {
//       console.error('Token verification error:', error);
//       res.status(401).json({
//         success: false,
//         message: 'Token is not valid',
//       });
//     }
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Authentication error',
//     });
//   }
// };
// export const authorizeRoles = (...allowedRoles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !allowedRoles.includes(req.user.accountType!)) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not have permission to perform this action",
//       });
//     }
//     next();
//   };
// };
// // Middleware to check if user is admin
// export const isAdmin = authorizeRoles("ADMIN");
// // Middleware to check if user is instructor
// export const isInstructor = authorizeRoles("TEACHER");
// // Middleware to check if user is student
// export const isStudent = authorizeRoles("STUDENT");
// // Middleware to check if user is either admin or instructor
// export const isAdminOrInstructor = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user?.accountType !== "ADMIN" && req.user?.accountType !== "TEACHER") {
//     return res.status(403).json({
//       success: false,
//       message: "This route is only accessible to admins and instructors",
//     });
//   }
//   next();
// }; 
