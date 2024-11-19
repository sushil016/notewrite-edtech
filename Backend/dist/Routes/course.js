"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_1 = require("../controllers/course");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers with Request
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
router.get('/:courseId/preview', asyncHandler(course_1.getCoursePreview));
// Protected routes that need authentication
router.get('/enrolled', authMiddleware_1.authenticateUser, authAsyncHandler(course_1.getEnrolledCourses));
router.get('/teacher-courses', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.getTeacherCourses));
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.createCourse));
router.put('/:courseId/publish', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.publishCourse));
router.put('/:courseId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.updateCourse));
router.get('/:courseId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, authAsyncHandler(course_1.getCourseDetails));
router.get('/:courseId/learn', authMiddleware_1.authenticateUser, authAsyncHandler(course_1.getCourseLearningDetails));
router.get('/:courseId/progress', authMiddleware_1.authenticateUser, authAsyncHandler(course_1.getCourseProgress));
router.post('/:courseId/complete-video', authMiddleware_1.authenticateUser, authAsyncHandler(course_1.markVideoComplete));
exports.default = router;
