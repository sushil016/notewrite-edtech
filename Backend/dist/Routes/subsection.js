"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subsection_1 = require("../controllers/subsection");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileSystem_1 = require("../utils/fileSystem");
const router = (0, express_1.Router)();
// Create uploads directory if it doesn't exist
const uploadsDir = (0, fileSystem_1.createUploadsDirectory)();
// Configure multer for video uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else if (file.fieldname === 'notes' && file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'));
    }
};
const limits = {
    fileSize: (req, file, cb) => {
        if (file.fieldname === 'video') {
            return 100 * 1024 * 1024; // 100MB for video
        }
        return 10 * 1024 * 1024; // 10MB for PDF
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // Default to 100MB, will be overridden by dynamic limit
    }
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'notes', maxCount: 1 }
]);
// Type-safe wrapper for async handlers with AuthRequest
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, upload, asyncHandler(subsection_1.createSubSection));
router.put('/update', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, upload, asyncHandler(subsection_1.updateSubSection));
router.delete('/:subSectionId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(subsection_1.deleteSubSection));
exports.default = router;
