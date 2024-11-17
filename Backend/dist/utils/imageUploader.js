"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadImageToCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath)
            return null;
        // Upload the file to Cloudinary
        const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
            folder: folder,
        });
        // Remove file from local storage
        fs_1.default.unlinkSync(localFilePath);
        return response.secure_url;
    }
    catch (error) {
        // Remove file from local storage if upload fails
        fs_1.default.unlinkSync(localFilePath);
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
