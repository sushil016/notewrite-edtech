"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const settingsController_1 = require("../controllers/settingsController");
const router = express_1.default.Router();
// Wrap the async handlers to properly handle promises
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/', authMiddleware_1.authenticateUser, asyncHandler(settingsController_1.getUserSettings));
router.put('/update', authMiddleware_1.authenticateUser, asyncHandler(settingsController_1.updateSettings));
router.put('/update-password', authMiddleware_1.authenticateUser, asyncHandler(settingsController_1.updatePassword));
exports.default = router;
