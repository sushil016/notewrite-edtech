"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, contactNumber, accountType, otp, } = req.body;
        console.log('Received signup data:', {
            firstName,
            lastName,
            email,
            contactNumber,
            accountType,
            otp,
            hasPassword: !!password
        });
        // Validation
        if (!firstName || !lastName || !email || !password || !contactNumber || !otp) {
            console.log('Missing required fields:', {
                hasFirstName: !!firstName,
                hasLastName: !!lastName,
                hasEmail: !!email,
                hasPassword: !!password,
                hasContactNumber: !!contactNumber,
                hasOTP: !!otp
            });
            res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
            return;
        }
        // Verify OTP
        const recentOTP = yield app_1.prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });
        console.log('OTP verification:', {
            receivedOTP: otp,
            storedOTP: recentOTP === null || recentOTP === void 0 ? void 0 : recentOTP.otp,
            email,
            otpCreatedAt: recentOTP === null || recentOTP === void 0 ? void 0 : recentOTP.createdAt
        });
        if (!recentOTP) {
            res.status(400).json({
                success: false,
                message: "No OTP found for this email go to signup page",
            });
            return;
        }
        if (recentOTP.otp !== otp) {
            res.status(400).json({
                success: false,
                message: "Invalid OTP from signup page",
                debug: {
                    receivedOTP: otp,
                    storedOTP: recentOTP.otp
                }
            });
            return;
        }
        // Check if user exists
        const existingUser = yield app_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        // Create profile
        const profile = yield app_1.prisma.profile.create({
            data: {
                gender: null,
                dateOfBirth: null,
                about: null,
            },
        });
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield app_1.prisma.user.create({
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
        // Generate token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            accountType: user.accountType
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType,
            },
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield app_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
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
});
exports.login = login;
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        // Get full user data from database
        const user = yield app_1.prisma.user.findUnique({
            where: { id: req.user.id },
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
                message: 'User not found'
            });
            return;
        }
        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyAuth = verifyAuth;
