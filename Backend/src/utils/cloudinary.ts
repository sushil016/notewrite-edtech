import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file: UploadedFile, folder: string) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder,
            resource_type: "auto"
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}; 