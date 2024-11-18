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
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(course_1.createCourse));
router.get('/teacher-courses', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(course_1.getTeacherCourses));
router.get('/:courseId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(course_1.getCourseDetails));
exports.default = router;
