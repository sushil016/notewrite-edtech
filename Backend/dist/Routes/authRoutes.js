"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const otpController_1 = require("../controllers/otpController");
const changePassword_1 = require("../controllers/changePassword");
const auth_2 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Error handler wrapper
const asyncHandler = (fn) => (req, res) => {
    Promise.resolve(fn(req, res)).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    });
};
// Auth routes
router.post('/signup', asyncHandler(auth_1.signup));
router.post('/login', asyncHandler(auth_1.login));
router.post('/send-otp', asyncHandler(otpController_1.sendOTP));
router.post('/verify-otp', asyncHandler(otpController_1.verifyOTP));
router.post('/change-password', asyncHandler(changePassword_1.changePassword));
router.get('/verify', auth_2.authenticateUser, asyncHandler(auth_1.verifyAuth));
// Protected routes
// router.get('/admin-only', authenticateUser, isAdmin, (req: Request, res: Response) => {
//     res.json({ message: "Admin access granted" });
// });
// router.get('/instructor-only', authenticateUser, isInstructor, (req: Request, res: Response) => {
//     res.json({ message: "Instructor access granted" });
// });
// router.get('/student-only', authenticateUser, isStudent, (req: Request, res: Response) => {
//     res.json({ message: "Student access granted" });
// });
exports.default = router;
