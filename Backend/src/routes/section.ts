import { Router } from 'express';
import { createSection, updateSection, deleteSection } from '../controllers/section';
import { authenticateUser, isTeacher } from '../middlewares/authMiddleware';
import { RequestHandler } from 'express';

const router = Router();

// Type-safe wrapper for async handlers
const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/create', authenticateUser, isTeacher, asyncHandler(createSection));
router.put('/update', authenticateUser, isTeacher, asyncHandler(updateSection));
router.delete('/:sectionId', authenticateUser, isTeacher, asyncHandler(deleteSection));

export default router; 