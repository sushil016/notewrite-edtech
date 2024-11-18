"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstructor = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }
        req.user = {
            id: user.id,
            email: user.email,
            accountType: user.accountType
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
exports.auth = auth;
const isInstructor = (req, res, next) => {
    var _a;
    const authReq = req;
    if (((_a = authReq.user) === null || _a === void 0 ? void 0 : _a.accountType) !== client_1.AccountType.TEACHER) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Instructor only."
        });
    }
    next();
};
exports.isInstructor = isInstructor;
