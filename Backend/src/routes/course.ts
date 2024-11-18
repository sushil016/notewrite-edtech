import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { createCourse } from '../controllers/course';
import { auth, isInstructor, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

// Create type-safe middleware wrappers
const authMiddleware: RequestHandler = async (req, res, next) => {
    try {
        await auth(req as Request, res, next);
    } catch (error) {
        next(error);
    }
};

const instructorMiddleware: RequestHandler = async (req, res, next) => {
    try {
        await isInstructor(req as Request, res, next);
    } catch (error) {
        next(error);
    }
};

router.post('/create', authMiddleware, instructorMiddleware, createCourse);

export default router; 