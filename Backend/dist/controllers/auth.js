"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, contactNumber, accountType, } = req.body;
        // Validation
        if (!firstName || !lastName || !email || !password || !contactNumber) {
            res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
            return;
        }
        // if (password !== confirmPassword) {
        //   console.log('Password mismatch:', { password, confirmPassword });
        //   res.status(400).json({
        //     success: false,
        //     message: "Passwords do not match",
        //   });
        //   return;
        // }
        // Check if user exists
        const existingUser = await app_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        // Verify OTP
        const recentOTP = await app_1.prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });
        if (!recentOTP || recentOTP.otp !== req.body.otp) {
            res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
            return;
        }
        // Create profile
        const profile = await app_1.prisma.profile.create({
            data: {
                gender: null,
                dateOfBirth: null,
                about: null,
            },
        });
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await app_1.prisma.user.create({
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
        res.status(201).json({
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
        next(error);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await app_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Generate token with proper payload
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            accountType: user.accountType
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Set token in both cookie and response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const verifyAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        res.json({
            success: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                accountType: req.user.accountType,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyAuth = verifyAuth;
