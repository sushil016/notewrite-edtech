"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateSettings = exports.getUserSettings = void 0;
const client_1 = require("@prisma/client");
const passwordUtils_1 = require("../utils/passwordUtils");
const prisma = new client_1.PrismaClient();
const getUserSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = await prisma.userSettings.findUnique({
            where: { userId },
        });
        if (!settings) {
            // Create default settings if they don't exist
            const defaultSettings = await prisma.userSettings.create({
                data: {
                    userId,
                    theme: 'dark',
                    fontSize: 'medium',
                    notifications: {
                        email: true,
                        push: false,
                        updates: true,
                        marketing: false,
                    },
                    privacy: {
                        profileVisibility: 'public',
                        twoFactorEnabled: false,
                    },
                },
            });
            res.status(200).json({
                success: true,
                data: defaultSettings,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: settings,
        });
        return;
    }
    catch (error) {
        console.error('Error in getUserSettings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
};
exports.getUserSettings = getUserSettings;
const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { theme, fontSize, notifications, privacy } = req.body;
        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId },
            update: {
                theme,
                fontSize,
                notifications,
                privacy,
            },
            create: {
                userId,
                theme,
                fontSize,
                notifications,
                privacy,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: updatedSettings,
        });
    }
    catch (error) {
        console.error('Error in updateSettings:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update settings',
        });
    }
};
exports.updateSettings = updateSettings;
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const isPasswordValid = await (0, passwordUtils_1.comparePassword)(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }
        const hashedPassword = await (0, passwordUtils_1.hashPassword)(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        console.error('Error in updatePassword:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update password',
        });
    }
};
exports.updatePassword = updatePassword;
