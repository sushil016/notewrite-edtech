import { Router } from 'express';
import { createSection, updateSection, deleteSection, getSectionsByCourse } from '../controllers/section';
import { authenticateUser, isTeacher } from '../Middlewares/authMiddleware';
import { RequestHandler } from 'express';
import { AuthRequest } from '../types/express';
import { Response } from 'express';

const router = Router();

// Type-safe wrapper for async handlers with AuthRequest
const asyncHandler = <T extends AuthRequest>(
  fn: (req: T, res: Response) => Promise<void>
): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req as unknown as T, res)).catch(next);
  };

router.post('/create', 
  authenticateUser, 
  isTeacher, 
  asyncHandler(createSection)
);

router.put('/update', 
  authenticateUser, 
  isTeacher, 
  asyncHandler(updateSection)
);

router.delete('/:sectionId', 
  authenticateUser, 
  isTeacher, 
  asyncHandler(deleteSection)
);

router.get('/course/:courseId', 
  authenticateUser, 
  isTeacher, 
  asyncHandler(getSectionsByCourse)
);

export default router; 