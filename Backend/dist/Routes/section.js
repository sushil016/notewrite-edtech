"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const section_1 = require("../controllers/section");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Create type-safe middleware wrappers
const authMiddleware = async (req, res, next) => {
    try {
        await (0, authMiddleware_1.auth)(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
const instructorMiddleware = async (req, res, next) => {
    try {
        await (0, authMiddleware_1.isInstructor)(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
// Apply the middleware wrappers to routes
router.post('/create', authMiddleware, instructorMiddleware, section_1.createSection);
router.put('/update', authMiddleware, instructorMiddleware, section_1.updateSection);
router.delete('/:sectionId', authMiddleware, instructorMiddleware, section_1.deleteSection);
exports.default = router;
