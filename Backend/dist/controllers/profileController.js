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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = exports.updateProfile = exports.getUserProfile = void 0;
const client_1 = require("@prisma/client");
const imageUploader_1 = require("../utils/imageUploader");
const prisma = new client_1.PrismaClient();
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        const { password, token, resetPasswordExpires } = user, userInfo = __rest(user, ["password", "token", "resetPasswordExpires"]);
        res.status(200).json({
            success: true,
            data: userInfo,
        });
    }
    catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getUserProfile = getUserProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { firstName, lastName, contactNumber, gender, dateOfBirth, about, } = req.body;
        let imageUrl = null;
        if (req.file) {
            imageUrl = yield (0, imageUploader_1.uploadImageToCloudinary)(req.file.path, 'profile-pictures');
        }
        const updatedUser = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.update({
                where: { id: userId },
                data: Object.assign({ firstName,
                    lastName,
                    contactNumber }, (imageUrl && { image: imageUrl })),
            });
            const profile = yield prisma.profile.update({
                where: { id: user.profileId },
                data: {
                    gender,
                    dateOfBirth,
                    about,
                },
            });
            return Object.assign(Object.assign({}, user), { profile });
        }));
        const { password, token, resetPasswordExpires } = updatedUser, userInfo = __rest(updatedUser, ["password", "token", "resetPasswordExpires"]);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: userInfo,
        });
    }
    catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
        });
    }
});
exports.updateProfile = updateProfile;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
            return;
        }
        const imageUrl = yield (0, imageUploader_1.uploadImageToCloudinary)(req.file.path, 'profile-pictures');
        if (!imageUrl) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
            return;
        }
        res.status(200).json({
            success: true,
            imageUrl
        });
    }
    catch (error) {
        console.error('Error in uploadProfileImage:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
});
exports.uploadProfileImage = uploadProfileImage;
