"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailSender_1 = require("../utils/mailSender");
const app_1 = require("../app");
const changePassword = async (req, res, next) => {
    var _a;
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
            return;
        }
        const user = await app_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const isOldPasswordValid = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
            return;
        }
        if (oldPassword === newPassword) {
            res.status(400).json({
                success: false,
                message: "New password cannot be same as old password",
            });
            return;
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await app_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        // Send password update notification email
        await (0, mailSender_1.sendMail)({
            email: user.email,
            subject: "Password Updated Successfully",
            text: "Your password has been successfully updated. If you didn't make this change, please contact support immediately.",
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
