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
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, please login',
            });
            return;
        }
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined');
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = decoded;
            // Verify user exists in database
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    accountType: true,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            next();
        }
        catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({
                success: false,
                message: 'Token is not valid',
            });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error',
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
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountType) !== "ADMIN" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.accountType) !== "TEACHER") {
        return res.status(403).json({
            success: false,
            message: "This route is only accessible to admins and instructors",
        });
    }
    next();
};
exports.isAdminOrInstructor = isAdminOrInstructor;
