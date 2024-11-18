"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStudent = exports.isAdmin = exports.isTeacher = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const client_1 = require("@prisma/client");
const authenticateUser = async (req, res, next) => {
    var _a;
    try {
        // Check both Authorization header and cookies
        const authHeader = req.headers.authorization;
        const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))
            ? authHeader.substring(7)
            : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await app_1.prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    accountType: true,
                }
            });
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token. User not found.'
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (jwtError) {
            console.error('JWT Verification Error:', jwtError);
            res.status(401).json({
                success: false,
                message: 'Invalid token format or signature.'
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateUser = authenticateUser;
const isTeacher = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountType) !== client_1.AccountType.TEACHER) {
        res.status(403).json({
            success: false,
            message: 'Access denied. Teachers only.'
        });
        return;
    }
    next();
};
exports.isTeacher = isTeacher;
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountType) !== client_1.AccountType.ADMIN) {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admins only.'
        });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
const isStudent = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountType) !== client_1.AccountType.STUDENT) {
        res.status(403).json({
            success: false,
            message: 'Access denied. Students only.'
        });
        return;
    }
    next();
};
exports.isStudent = isStudent;
