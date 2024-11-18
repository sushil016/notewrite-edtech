import { Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../types/express';

interface CreateSectionRequest {
    sectionName: string;
    courseId: string;
}

type SectionAuthRequest = AuthRequest & { body: CreateSectionRequest };

export const createSection = async (req: SectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { sectionName, courseId } = req.body;
        const teacherId = req.user.id;

        if (!sectionName || !courseId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
            return;
        }

        // Verify the course belongs to the teacher
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                teacherId
            }
        });

        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found or you don't have permission"
            });
            return;
        }

        const section = await prisma.section.create({
            data: {
                sectionName,
                course: {
                    connect: { id: courseId }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Section created successfully",
            data: section
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating section"
        });
    }
};

interface UpdateSectionRequest {
    sectionName: string;
    sectionId: string;
}

type UpdateSectionAuthRequest = AuthRequest & { body: UpdateSectionRequest };

export const updateSection = async (req: UpdateSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { sectionName, sectionId } = req.body;
        const teacherId = req.user.id;

        if (!sectionName || !sectionId) {
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

        const updatedSection = await prisma.section.update({
            where: { id: sectionId },
            data: { sectionName }
        });

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating section"
        });
    }
};

type DeleteSectionAuthRequest = AuthRequest & { params: { sectionId: string } };

export const deleteSection = async (req: DeleteSectionAuthRequest, res: Response): Promise<void> => {
    try {
        const { sectionId } = req.params;
        const teacherId = req.user.id;

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

        // First delete all subsections
        await prisma.subSection.deleteMany({
            where: {
                sectionId: sectionId
            }
        });

        // Then delete the section
        await prisma.section.delete({
            where: {
                id: sectionId
            }
        });

        res.status(200).json({
            success: true,
            message: "Section and its subsections deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting section"
        });
    }
};

type GetSectionsByCourseRequest = AuthRequest & { params: { courseId: string } };

export const getSectionsByCourse = async (req: GetSectionsByCourseRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;

        // Verify the course belongs to the teacher
        const sections = await prisma.section.findMany({
            where: {
                courseId,
                course: {
                    teacherId
                }
            },
            orderBy: {
                id: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            data: sections
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching sections"
        });
    }
}; 