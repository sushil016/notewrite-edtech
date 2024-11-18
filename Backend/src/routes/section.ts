import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { createSection, updateSection, deleteSection } from '../controllers/section';
import { auth, isInstructor } from '../middlewares/authMiddleware';

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

// Apply the middleware wrappers to routes
router.post('/create', authMiddleware, instructorMiddleware, createSection);
router.put('/update', authMiddleware, instructorMiddleware, updateSection);
router.delete('/:sectionId', authMiddleware, instructorMiddleware, deleteSection);

export default router; 