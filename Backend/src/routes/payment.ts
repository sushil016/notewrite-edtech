import { Router } from 'express';
import { capturePayment, verifyPayment } from '../controllers/payment';
import { authenticateUser } from '../Middlewares/authMiddleware';
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

router.post('/capture', 
  authenticateUser, 
  asyncHandler(capturePayment)
);

router.post('/verify', 
  authenticateUser, 
  asyncHandler(verifyPayment)
);

export default router; 