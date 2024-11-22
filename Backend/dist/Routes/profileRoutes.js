"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const multer_1 = require("../Middlewares/multer");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
// Wrap the async handlers to properly handle promises
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/', authMiddleware_1.authenticateUser, asyncHandler(profileController_1.getUserProfile));
router.put('/update', authMiddleware_1.authenticateUser, multer_1.upload.single('image'), asyncHandler(profileController_1.updateProfile));
router.post('/upload-image', authMiddleware_1.authenticateUser, multer_1.upload.single('image'), asyncHandler(profileController_1.uploadProfileImage));
exports.default = router;
