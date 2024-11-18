import { Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../types/express';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { uploadToCloudinary } from '../utils/cloudinary';

interface CreateSubSectionRequest {
    title: string;
    description: string;
    timeDuration: string;
    sectionId: string;
}

type SubSectionAuthRequest = AuthRequest & { 
    body: CreateSubSectionRequest;
    file?: Express.Multer.File;
};

export const createSubSection = async (req: SubSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, timeDuration, sectionId } = req.body;
        const teacherId = req.user.id;

        if (!title || !description || !timeDuration || !sectionId || !req.file) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
            return;
        }

        // Verify the section belongs to a course owned by the teacher
        const section = await prisma.section.findFirst({
            where: {
                id: sectionId,
                course: {
                    teacherId
                }
            }
        });

        if (!section) {
            res.status(404).json({
                success: false,
                message: "Section not found or you don't have permission"
            });
            return;
        }

        // Upload video to cloudinary
        const uploadResponse = await uploadToCloudinary(req.file.path, 'course-videos');

        if (!uploadResponse || !uploadResponse.secure_url) {
            res.status(500).json({
                success: false,
                message: "Error uploading video"
            });
            return;
        }

        const subSection = await prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: uploadResponse.secure_url,
                section: {
                    connect: { id: sectionId }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            data: subSection
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating subsection"
        });
    }
};

interface UpdateSubSectionRequest {
    title?: string;
    description?: string;
    timeDuration?: string;
    subSectionId: string;
}

type UpdateSubSectionAuthRequest = AuthRequest & { 
    body: UpdateSubSectionRequest;
    file?: Express.Multer.File;
};

export const updateSubSection = async (req: UpdateSubSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, timeDuration, subSectionId } = req.body;
        const teacherId = req.user.id;

        // Verify the subsection belongs to a course owned by the teacher
        const subSection = await prisma.subSection.findFirst({
            where: {
                id: subSectionId,
                section: {
                    course: {
                        teacherId
                    }
                }
            }
        });

        if (!subSection) {
            res.status(404).json({
                success: false,
                message: "Subsection not found or you don't have permission"
            });
            return;
        }

        let videoUrl: string | undefined;
        if (req.file) {
            const uploadResponse = await uploadToCloudinary(req.file.path, 'course-videos');
            if (!uploadResponse || !uploadResponse.secure_url) {
                res.status(500).json({
                    success: false,
                    message: "Error uploading video"
                });
                return;
            }
            videoUrl = uploadResponse.secure_url;
        }

        const updatedSubSection = await prisma.subSection.update({
            where: { id: subSectionId },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(timeDuration && { timeDuration }),
                ...(videoUrl && { videoUrl })
            }
        });

        res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedSubSection
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating subsection"
        });
    }
};

type DeleteSubSectionAuthRequest = AuthRequest & { params: { subSectionId: string } };

export const deleteSubSection = async (req: DeleteSubSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { subSectionId } = req.params;
        const teacherId = req.user.id;

        // Verify the subsection belongs to a course owned by the teacher
        const subSection = await prisma.subSection.findFirst({
            where: {
                id: subSectionId,
                section: {
                    course: {
                        teacherId
                    }
                }
            }
        });

        if (!subSection) {
            res.status(404).json({
                success: false,
                message: "Subsection not found or you don't have permission"
            });
            return;
        }

        await prisma.subSection.delete({
            where: { id: subSectionId }
        });

        res.status(200).json({
            success: true,
            message: "Subsection deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting subsection"
        });
    }
}; 