import { Router, Request, Response } from 'express';
import { signup, login, verifyAuth } from '../controllers/auth';
import { sendOTP, verifyOTP } from '../controllers/otpController';
import { changePassword } from '../controllers/changePassword';
import { 
  authenticateUser, 
  isAdmin, 
  isInstructor, 
  isStudent 
} from '../middlewares/auth';

const router = Router();

// Error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    });
};

// Auth routes
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/send-otp', asyncHandler(sendOTP));
router.post('/verify-otp', asyncHandler(verifyOTP));
router.post('/change-password', asyncHandler(changePassword));
router.get('/verify', authenticateUser, asyncHandler(verifyAuth));

// Protected routes
// router.get('/admin-only', authenticateUser, isAdmin, (req: Request, res: Response) => {
//     res.json({ message: "Admin access granted" });
// });

// router.get('/instructor-only', authenticateUser, isInstructor, (req: Request, res: Response) => {
//     res.json({ message: "Instructor access granted" });
// });

// router.get('/student-only', authenticateUser, isStudent, (req: Request, res: Response) => {
//     res.json({ message: "Student access granted" });
// });

export default router; 