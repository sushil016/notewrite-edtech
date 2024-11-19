"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_1 = require("../controllers/course");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers with AuthRequest
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
// Type-safe wrapper specifically for authenticated routes
const authAsyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
// Public routes (no authentication required)
router.get('/recent', asyncHandler(course_1.getRecentCourses));
router.get('/', asyncHandler(course_1.getAllCourses));
// Protected routes
router.get('/teacher-courses', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.getTeacherCourses));
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.createCourse));
router.put('/:courseId/publish', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.publishCourse));
router.put('/:courseId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.updateCourse));
router.get('/:courseId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.getCourseDetails));
exports.default = router;
