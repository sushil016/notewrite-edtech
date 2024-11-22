import { Router } from 'express';
import { signup, login, verifyAuth } from '../controllers/auth';
import { sendOTP, verifyOTP } from '../controllers/otpController';
import { changePassword } from '../controllers/changePassword';
import { authenticateUser } from '../Middlewares/authMiddleware';
import { RequestHandler } from 'express';

const router = Router();

// Type-safe wrapper for async handlers
const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Auth routes with proper typing
router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);
router.get('/me', authenticateUser, verifyAuth);

export default router; 