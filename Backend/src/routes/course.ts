import { Router } from 'express';
import { 
  createCourse, 
  getTeacherCourses, 
  getCourseDetails, 
  publishCourse, 
  updateCourse, 
  getRecentCourses,
  getAllCourses,
  getCoursePreview,
  getEnrolledCourses,
  getCourseLearningDetails,
  getCourseProgress,
  markVideoComplete
} from '../controllers/course';
import { authenticateUser, isTeacher } from '../Middlewares/authMiddleware';
import { RequestHandler, Response, Request } from 'express';
import { AuthRequest } from '../types/express';

const router = Router();

// Type-safe wrapper for async handlers with Request
const asyncHandler = <T extends Request>(
  fn: (req: T, res: Response) => Promise<void>
): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req as T, res)).catch(next);
  };

// Type-safe wrapper specifically for authenticated routes
const authAsyncHandler = <T extends AuthRequest>(
  fn: (req: T, res: Response) => Promise<void>
): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req as unknown as T, res)).catch(next);
  };

// Public routes (no authentication required)
router.get('/recent', asyncHandler(getRecentCourses));
router.get('/', asyncHandler(getAllCourses));
router.get('/:courseId/preview', asyncHandler(getCoursePreview));

// Protected routes that need authentication
router.get('/enrolled', 
  authenticateUser, 
  authAsyncHandler(getEnrolledCourses)
);

router.get('/teacher-courses', 
  authenticateUser, 
  isTeacher, 
  authAsyncHandler(getTeacherCourses)
);

router.post('/create', 
  authenticateUser, 
  isTeacher, 
  authAsyncHandler(createCourse)
);

router.put('/:courseId/publish', 
  authenticateUser, 
  isTeacher, 
  authAsyncHandler(publishCourse)
);

router.put('/:courseId', 
  authenticateUser, 
  isTeacher, 
  authAsyncHandler(updateCourse)
);

router.get('/:courseId', 
  authenticateUser, 
  isTeacher, 
  authAsyncHandler(getCourseDetails)
);

router.get('/:courseId/learn', 
  authenticateUser, 
  authAsyncHandler(getCourseLearningDetails)
);

router.get('/:courseId/progress', 
  authenticateUser, 
  authAsyncHandler(getCourseProgress)
);

router.post('/:courseId/complete-video', 
  authenticateUser, 
  authAsyncHandler(markVideoComplete)
);

export default router; 