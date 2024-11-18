import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (
    filePath: string, 
    folder: string
): Promise<UploadApiResponse | null> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto"
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
    }
}; 