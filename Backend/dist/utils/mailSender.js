"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true // Enable debug logs
});
const sendMail = async (mailData) => {
    try {
        // Verify connection configuration
        await transporter.verify();
        const info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.SMTP_FROM}>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
            text: mailData.text
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
exports.sendMail = sendMail;
