"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const getOTPEmailTemplate = ({ userEmail, otp, validityTime }) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 20px;">Email Verification - NoteWrite</h2>
        
        <p style="color: #374151; font-size: 16px;">Hello,</p>
        
        <p style="color: #374151; margin-bottom: 20px;">
          Thank you for registering with NoteWrite. Please use the following OTP to verify your email address.
        </p>

        <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
          <h3 style="color: #111827; margin-bottom: 15px;">Your OTP Code:</h3>
          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #3B82F6;
            background-color: #EFF6FF;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
          ">
            ${otp}
          </div>
          <p style="color: #EF4444; font-size: 14px;">
            This OTP will expire in ${validityTime} minutes
          </p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #111827; margin-bottom: 15px;">Important Information:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="color: #374151; margin-bottom: 8px;">
              • This OTP is valid for ${validityTime} minutes only
            </li>
            <li style="color: #374151; margin-bottom: 8px;">
              • Please do not share this OTP with anyone
            </li>
            <li style="color: #374151; margin-bottom: 8px;">
              • If you didn't request this OTP, please ignore this email
            </li>
          </ul>
        </div>

        <p style="color: #374151; font-size: 14px;">
          If you have any questions, please contact our support team.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #D1D5DB; font-size: 12px; color: #6B7280;">
          <p>This is an automated message from NoteWrite. Please do not reply to this email.</p>
          <p>If you did not sign up for NoteWrite, please disregard this email.</p>
        </div>
      </div>
    </div>
  `;
};
const sendMail = async ({ email, subject, text }) => {
    var _a;
    // Extract OTP from text (assuming it's in the format "Your OTP is: 123456")
    const otp = ((_a = text.match(/\d{6}/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: getOTPEmailTemplate({
            userEmail: email,
            otp,
            validityTime: 5 // 5 minutes validity
        }),
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
exports.sendMail = sendMail;
