import { Request, Response, NextFunction } from 'express';
import { PrismaClient, CourseStatus } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, tag, categoryId, instructions } = req.body;
        const userId = (req as AuthRequest).user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        if (!courseName || !courseDescription || !whatYouWillLearn || !categoryId) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }

        const course = await prisma.course.create({
            data: {
                courseName,
                courseDescription,
                whatYouWillLearn,
                tag,
                instructions,
                teacher: {
                    connect: { id: userId }
                },
                category: {
                    connect: { id: categoryId }
                }
            },
            include: {
                teacher: true,
                category: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: course
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating course"
        });
    }
}; 