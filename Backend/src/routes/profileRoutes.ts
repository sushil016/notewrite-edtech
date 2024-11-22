import express, { Request, Response, NextFunction } from 'express'
import { authenticateUser } from '../Middlewares/authMiddleware'
import { upload } from '../Middlewares/multer'
import {
  getUserProfile,
  updateProfile,
  uploadProfileImage
} from '../controllers/profileController'

const router = express.Router()

// Wrap the async handlers to properly handle promises
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticateUser, asyncHandler(getUserProfile));

router.put(
  '/update',
  authenticateUser,
  upload.single('image'),
  asyncHandler(updateProfile)
);

router.post(
  '/upload-image',
  authenticateUser,
  upload.single('image'),
  asyncHandler(uploadProfileImage)
);

export default router 