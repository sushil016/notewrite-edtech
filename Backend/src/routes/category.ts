import { Router } from 'express';
import { createCategory, getAllCategories, getCategoryById } from '../controllers/category';
import { authenticateUser, isTeacher } from '../middlewares/authMiddleware';
import { RequestHandler } from 'express';

const router = Router();

// Type-safe wrapper for async handlers
const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Apply middleware and wrap handlers
router.post('/create', authenticateUser, isTeacher, asyncHandler(createCategory));
router.get('/all', asyncHandler(getAllCategories));
router.get('/:categoryId', asyncHandler(getCategoryById));

export default router; 