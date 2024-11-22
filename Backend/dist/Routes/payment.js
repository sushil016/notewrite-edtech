"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_1 = require("../controllers/payment");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Type-safe wrapper for async handlers with AuthRequest
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
router.post('/capture', authMiddleware_1.authenticateUser, asyncHandler(payment_1.capturePayment));
router.post('/verify', authMiddleware_1.authenticateUser, asyncHandler(payment_1.verifyPayment));
exports.default = router;
