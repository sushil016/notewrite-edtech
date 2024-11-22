"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../controllers/category");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Apply middleware and wrap handlers
router.post('/create', authMiddleware_1.authenticateUser, authMiddleware_1.isTeacher, asyncHandler(category_1.createCategory));
router.get('/all', asyncHandler(category_1.getAllCategories));
router.get('/:categoryId', asyncHandler(category_1.getCategoryById));
exports.default = router;
