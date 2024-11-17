"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, contactNumber, accountType, } = req.body;
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // Verify OTP
        const recentOTP = await prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });
        if (!recentOTP || recentOTP.otp !== req.body.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        // Create profile
        const profile = await prisma.profile.create({
            data: {
                gender: null,
                dateOfBirth: null,
                about: null,
            },
        });
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                contactNumber,
                accountType,
                profileId: profile.id,
            },
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        // Generate token with all necessary information
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            accountType: user.accountType
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Set cookie with proper options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/' // Add this to ensure cookie is available for all paths
        });
        // Send response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
const verifyAuth = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                accountType: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error("Verify auth error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.verifyAuth = verifyAuth;
