import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { createCategory, getAllCategories, getCategoryById } from '../controllers/category';
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

// Apply middleware wrappers to routes
router.post('/create', authMiddleware, instructorMiddleware, createCategory as RequestHandler);
router.get('/all', getAllCategories as RequestHandler);
router.get('/:categoryId', getCategoryById as RequestHandler);

export default router; 