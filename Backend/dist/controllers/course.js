"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = exports.getRecentCourses = exports.updateCourse = exports.publishCourse = exports.getCourseDetails = exports.getTeacherCourses = exports.createCourse = void 0;
const mailSender_1 = require("../utils/mailSender");
const app_1 = require("../app");
const createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag, categoryId, instructions } = req.body;
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
        const coursePrice = typeof price === 'string' ? parseFloat(price) : price;
        const course = await app_1.prisma.course.create({
            data: {
                courseName,
                courseDescription,
                whatYouWillLearn,
                price: coursePrice,
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
const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;
        console.log('Publishing course:', { courseId, teacherId });
        // Verify course ownership
        const course = await app_1.prisma.course.findFirst({
            where: {
                id: courseId,
                teacherId,
            },
            include: {
                sections: {
                    include: {
                        subSections: true,
                    },
                },
            },
        });
        if (!course) {
            console.log('Course not found:', { courseId, teacherId });
            res.status(404).json({
                success: false,
                message: "Course not found or you don't have permission",
            });
            return;
        }
        // Verify that course has at least one section and each section has at least one subsection
        const isComplete = course.sections.length > 0 &&
            course.sections.every(section => section.subSections.length > 0);
        if (!isComplete) {
            res.status(400).json({
                success: false,
                message: "Course must have at least one section with content before publishing",
            });
            return;
        }
        // Update course status to published
        const updatedCourse = await app_1.prisma.course.update({
            where: { id: courseId },
            data: { status: 'PUBLISHED' },
        });
        // Send email notification
        await (0, mailSender_1.sendMail)({
            email: req.user.email,
            subject: "Course Published Successfully",
            text: `Your course ${course.courseName} has been published successfully.`,
        });
        res.status(200).json({
            success: true,
            message: "Course published successfully",
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error('Error in publishCourse:', error);
        res.status(500).json({
            success: false,
            message: "Error publishing course",
        });
    }
};
exports.publishCourse = publishCourse;
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;
        const updateData = req.body;
        // Verify course ownership
        const course = await app_1.prisma.course.findFirst({
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
        const updatedCourse = await app_1.prisma.course.update({
            where: { id: courseId },
            data: updateData,
            include: {
                category: true,
                teacher: true
            }
        });
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating course"
        });
    }
};
exports.updateCourse = updateCourse;
const getRecentCourses = async (req, res) => {
    try {
        const courses = await app_1.prisma.course.findMany({
            where: {
                status: 'PUBLISHED'
            },
            orderBy: {
                id: 'desc'
            },
            take: 5,
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                category: true
            }
        });
        res.status(200).json({
            success: true,
            data: courses
        });
    }
    catch (error) {
        console.error('Error fetching recent courses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses"
        });
    }
};
exports.getRecentCourses = getRecentCourses;
const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const where = Object.assign(Object.assign({ status: 'PUBLISHED' }, (category && category !== 'All' && {
            category: {
                name: category
            }
        })), (search && {
            OR: [
                { courseName: { contains: search, mode: 'insensitive' } },
                { courseDescription: { contains: search, mode: 'insensitive' } }
            ]
        }));
        const [courses, totalCount] = await Promise.all([
            app_1.prisma.course.findMany({
                where,
                skip,
                take: limit,
                include: {
                    teacher: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    category: true,
                    students: true
                },
                orderBy: {
                    id: 'desc'
                }
            }),
            app_1.prisma.course.count({ where })
        ]);
        const hasMore = totalCount > skip + courses.length;
        res.status(200).json({
            success: true,
            data: courses,
            hasMore,
            totalCount
        });
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses"
        });
    }
};
exports.getAllCourses = getAllCourses;
