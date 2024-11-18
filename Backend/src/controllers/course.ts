import { Response } from 'express';
import { PrismaClient, CourseStatus } from '@prisma/client';
import { AuthRequest } from '../types/express';
import { sendMail } from '../utils/mailSender';
import { prisma } from '../app';

interface CreateCourseRequest {
    courseName: string;
    courseDescription: string;
    whatYouWillLearn: string;
    tag: string[];
    categoryId: string;
    instructions: string[];
}

type CourseAuthRequest = AuthRequest & { body: CreateCourseRequest };

export const createCourse = async (req: CourseAuthRequest, res: Response): Promise<void> => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, tag, categoryId, instructions } = req.body;
        const userId = req.user.id;

        if (!courseName || !courseDescription || !whatYouWillLearn || !categoryId) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }

        const tagArray = Array.isArray(tag) ? tag : [tag];
        const instructionsArray = Array.isArray(instructions) ? instructions : [instructions];

        const course = await prisma.course.create({
            data: {
                courseName,
                courseDescription,
                whatYouWillLearn,
                tag: tagArray,
                instructions: instructionsArray,
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

        // Send email notification
        await sendMail({
            email: req.user.email,
            subject: "Course Created Successfully",
            text: `Your course ${courseName} has been created successfully.`
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

export const getTeacherCourses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const teacherId = req.user.id;

        const courses = await prisma.course.findMany({
            where: {
                teacherId
            },
            include: {
                sections: {
                    include: {
                        subSections: true
                    }
                },
                category: true,
                students: true
            }
        });

        console.log('Found courses:', courses);

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error in getTeacherCourses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses"
        });
    }
};

// Update the request type for getCourseDetails
type CourseDetailsRequest = AuthRequest & { params: { courseId: string } };

export const getCourseDetails = async (req: CourseDetailsRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;

        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                teacherId
            },
            include: {
                sections: {
                    include: {
                        subSections: true
                    }
                },
                category: true,
                students: true
            }
        });

        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching course details"
        });
    }
}; 