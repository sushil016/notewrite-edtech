import { Router } from 'express';
import { createSubSection, updateSubSection, deleteSubSection } from '../controllers/subsection';
import { authenticateUser, isTeacher } from '../middlewares/authMiddleware';
import { RequestHandler } from 'express';
import { AuthRequest } from '../types/express';
import { Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createUploadsDirectory } from '../utils/fileSystem';

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = createUploadsDirectory();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Not a video file'));
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
}).single('video');

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
    upload,
    asyncHandler(createSubSection)
);

router.put('/update', 
    authenticateUser, 
    isTeacher,
    upload,
    asyncHandler(updateSubSection)
);

router.delete('/:subSectionId', 
    authenticateUser, 
    isTeacher, 
    asyncHandler(deleteSubSection)
);

export default router; 