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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true // Enable debug logs
});
const sendMail = (mailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify connection configuration
        yield transporter.verify();
        const info = yield transporter.sendMail({
            from: `"Notewrite" <${process.env.SMTP_FROM}>`,
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
});
exports.sendMail = sendMail;
