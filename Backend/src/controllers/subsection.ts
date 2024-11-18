import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { uploadToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

// Define a custom interface for the request with files
interface FileRequest extends Omit<Request, 'files'> {
    files?: {
        videoFile?: UploadedFile;
        [key: string]: UploadedFile | undefined;
    };
}

export const createSubSection = async (req: FileRequest, res: Response) => {
    try {
        const { sectionId, title, description, timeDuration } = req.body;
        const videoFile = req.files?.videoFile;

        if (!sectionId || !title || !description || !timeDuration || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Upload video to Cloudinary
        const videoUpload = await uploadToCloudinary(videoFile, 'course_videos');

        const subSection = await prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: videoUpload.secure_url,
                section: {
                    connect: { id: sectionId }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: subSection
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating subsection"
        });
    }
}; 