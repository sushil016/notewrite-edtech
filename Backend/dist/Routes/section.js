"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const section_1 = require("../controllers/section");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(section_1.createSection));
router.put('/update', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(section_1.updateSection));
router.delete('/:sectionId', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(section_1.deleteSection));
exports.default = router;
