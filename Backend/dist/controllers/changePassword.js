"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailSender_1 = require("../utils/mailSender");
const prisma = new client_1.PrismaClient();
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.id; // Assuming you have authentication middleware
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isOldPasswordValid = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old password",
            });
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        // Send password update notification email
        await (0, mailSender_1.sendMail)({
            email: user.email,
            subject: "Password Updated Successfully",
            text: "Your password has been successfully updated. If you didn't make this change, please contact support immediately.",
        });
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Error changing password",
        });
    }
};
exports.changePassword = changePassword;
