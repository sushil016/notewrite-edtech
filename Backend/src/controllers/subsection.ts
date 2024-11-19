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
    files?: {
        video?: Express.Multer.File[];
        notes?: Express.Multer.File[];
    };
};

export const createSubSection = async (req: SubSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, timeDuration, sectionId } = req.body;
        const teacherId = req.user.id;

        if (!title || !description || !timeDuration || !sectionId || !req.files?.video) {
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
        const videoResult = await uploadToCloudinary(
            req.files.video[0].path,
            'course-videos'
        );

        if (!videoResult) {
            res.status(500).json({
                success: false,
                message: "Error uploading video"
            });
            return;
        }

        // Upload PDF if present and initialize notesUrls array
        let notesUrls: string[] = [];
        if (req.files.notes?.[0]) {
            const notesResult = await uploadToCloudinary(
                req.files.notes[0].path,
                'course-notes'
            );
            if (notesResult) {
                notesUrls.push(notesResult.secure_url);
            }
        }

        const subSection = await prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: videoResult.secure_url,
                notesUrls: notesUrls || [],
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

export const updateSubSection = async (req: SubSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, timeDuration } = req.body;
        const { subSectionId } = req.params;
        const teacherId = req.user.id;

        // Verify ownership
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

        let videoUrl = subSection.videoUrl;
        if (req.files?.video?.[0]) {
            const videoResult = await uploadToCloudinary(
                req.files.video[0].path,
                'course-videos'
            );
            if (videoResult) {
                videoUrl = videoResult.secure_url;
            }
        }

        // Handle multiple PDF uploads
        let notesUrls = subSection.notesUrls || [];
        if (req.files?.notes) {
            const notePromises = req.files.notes.map(note => 
                uploadToCloudinary(note.path, 'course-notes')
            );
            const noteResults = await Promise.all(notePromises);
            const newNoteUrls = noteResults
                .filter(result => result !== null)
                .map(result => result!.secure_url);
            notesUrls = [...notesUrls, ...newNoteUrls];
        }

        const updatedSubSection = await prisma.subSection.update({
            where: { id: subSectionId },
            data: {
                title,
                description,
                timeDuration,
                videoUrl,
                notesUrls
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

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { subSectionId } = req.params;
        const { noteUrl } = req.body;
        const teacherId = req.user.id;

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

        const updatedNotes = subSection.notesUrls.filter(url => url !== noteUrl);

        await prisma.subSection.update({
            where: { id: subSectionId },
            data: {
                notesUrls: updatedNotes
            }
        });

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting note"
        });
    }
}; 