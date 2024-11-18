import { Router } from 'express';
import { createCourse, getTeacherCourses, getCourseDetails } from '../controllers/course';
import { authenticateUser, isTeacher } from '../middlewares/authMiddleware';
import { RequestHandler, Response } from 'express';
import { AuthRequest } from '../types/express';

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
  asyncHandler(createCourse)
);

router.get('/teacher-courses', 
    authenticateUser, 
    isTeacher, 
    asyncHandler(getTeacherCourses)
);

router.get('/:courseId', 
    authenticateUser, 
    isTeacher, 
    asyncHandler(getCourseDetails)
);

export default router; 