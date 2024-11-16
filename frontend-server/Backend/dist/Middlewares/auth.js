"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrInstructor = exports.isStudent = exports.isInstructor = exports.isAdmin = exports.authorizeRoles = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateUser = async (req, res, next) => {
    var _a;
    try {
        // Get token from header or cookies
        const token = req.cookies.token ||
            ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
exports.authenticateUser = authenticateUser;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.accountType)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
// Middleware to check if user is admin
exports.isAdmin = (0, exports.authorizeRoles)("ADMIN");
// Middleware to check if user is instructor
exports.isInstructor = (0, exports.authorizeRoles)("TEACHER");
// Middleware to check if user is student
exports.isStudent = (0, exports.authorizeRoles)("STUDENT");
// Middleware to check if user is either admin or instructor
const isAdminOrInstructor = (req, res, next) => {
    if (req.user.accountType !== "ADMIN" && req.user.accountType !== "TEACHER") {
        return res.status(403).json({
            success: false,
            message: "This route is only accessible to admins and instructors",
        });
    }
    next();
};
exports.isAdminOrInstructor = isAdminOrInstructor;
