"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseDetails = exports.getTeacherCourses = exports.createCourse = void 0;
const mailSender_1 = require("../utils/mailSender");
const app_1 = require("../app");
const createCourse = async (req, res) => {
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
        const course = await app_1.prisma.course.create({
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
        await (0, mailSender_1.sendMail)({
            email: req.user.email,
            subject: "Course Created Successfully",
            text: `Your course ${courseName} has been created successfully.`
        });
        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating course"
        });
    }
};
exports.createCourse = createCourse;
const getTeacherCourses = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const courses = await app_1.prisma.course.findMany({
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
    }
    catch (error) {
        console.error('Error in getTeacherCourses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses"
        });
    }
};
exports.getTeacherCourses = getTeacherCourses;
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;
        const course = await app_1.prisma.course.findFirst({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching course details"
        });
    }
};
exports.getCourseDetails = getCourseDetails;
