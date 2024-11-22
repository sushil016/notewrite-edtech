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
exports.__test__ = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validate environment variables at startup
const validateConfig = () => {
    const required = ['SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    // Log config (without sensitive data) for debugging
    console.log('Email Configuration:', {
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM,
        hasPassword: !!process.env.SMTP_PASS
    });
};
// Create transporter with more detailed configuration
const createTransporter = () => {
    validateConfig();
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        debug: true,
        logger: true, // Enable built-in logger
        // Additional configuration for better reliability
        pool: true,
        maxConnections: 3,
        rateDelta: 20000,
        rateLimit: 5,
        secure: true // Use TLS
    });
};
// Initialize transporter
const transporter = createTransporter();
const sendMail = (mailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify connection configuration
        console.log('Verifying transporter configuration...');
        yield transporter.verify();
        console.log('Transporter verification successful');
        // Log email attempt (without sensitive data)
        console.log('Attempting to send email:', {
            to: mailData.email,
            subject: mailData.subject,
            hasHtml: !!mailData.html,
            hasText: !!mailData.text
        });
        const info = yield transporter.sendMail({
            from: `"Notewrite" <${process.env.SMTP_FROM}>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
            text: mailData.text
        });
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response
        });
        return info;
    }
    catch (error) {
        // Enhanced error logging
        console.error('Detailed email error:', {
            error: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            stack: error.stack
        });
        throw new Error(`Failed to send email: ${error.message}`);
    }
});
exports.sendMail = sendMail;
// Export for testing purposes
exports.__test__ = {
    validateConfig,
    createTransporter
};
