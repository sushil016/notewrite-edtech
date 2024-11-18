"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const otpController_1 = require("../controllers/otpController");
const changePassword_1 = require("../controllers/changePassword");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Auth routes with proper typing
router.post('/signup', auth_1.signup);
router.post('/login', auth_1.login);
router.post('/send-otp', otpController_1.sendOTP);
router.post('/verify-otp', otpController_1.verifyOTP);
router.post('/change-password', changePassword_1.changePassword);
router.get('/me', authMiddleware_1.authenticateUser, auth_1.verifyAuth);
exports.default = router;
