import express, { Request, Response, NextFunction } from 'express'
import { authenticateUser } from '../Middlewares/authMiddleware'
import {
  getUserSettings,
  updateSettings,
  updatePassword,
} from '../controllers/settingsController'

const router = express.Router()

// Wrap the async handlers to properly handle promises
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticateUser, asyncHandler(getUserSettings));

router.put('/update', authenticateUser, asyncHandler(updateSettings));

router.put('/update-password', authenticateUser, asyncHandler(updatePassword));

export default router 