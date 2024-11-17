"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// // Extend Express Request type to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }
// export const authenticateUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Get token from header or cookies
//     const token = 
//       req.cookies.token || 
//       req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication token missing",
//       });
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Authentication failed",
//     });
//   }
// };
// export const authorizeRoles = (...allowedRoles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !allowedRoles.includes(req.user.accountType)) {
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
//   if (req.user.accountType !== "ADMIN" && req.user.accountType !== "TEACHER") {
//     return res.status(403).json({
//       success: false,
//       message: "This route is only accessible to admins and instructors",
//     });
//   }
//   next();
// }; 
