"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markVideoComplete = exports.getCourseProgress = exports.getCourseLearningDetails = exports.getEnrolledCourses = exports.getCoursePreview = exports.getAllCourses = exports.getRecentCourses = exports.updateCourse = exports.publishCourse = exports.getCourseDetails = exports.getTeacherCourses = exports.createCourse = void 0;
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
const getCoursePreview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await app_1.prisma.course.findFirst({
            where: {
                id: courseId,
                status: 'PUBLISHED'
            },
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                category: true,
                sections: {
                    include: {
                        subSections: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                timeDuration: true
                            }
                        }
                    }
                }
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
        console.error('Error fetching course preview:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching course"
        });
    }
};
exports.getCoursePreview = getCoursePreview;
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrolledCourses = await app_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                enrolledCourses: {
                    include: {
                        teacher: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        },
                        category: true,
                        sections: {
                            include: {
                                subSections: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            data: (enrolledCourses === null || enrolledCourses === void 0 ? void 0 : enrolledCourses.enrolledCourses) || []
        });
    }
    catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching enrolled courses"
        });
    }
};
exports.getEnrolledCourses = getEnrolledCourses;
const getCourseLearningDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        // Check if user is enrolled in the course
        const enrollment = await app_1.prisma.course.findFirst({
            where: {
                id: courseId,
                students: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                category: true,
                sections: {
                    include: {
                        subSections: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                videoUrl: true,
                                timeDuration: true
                            }
                        }
                    }
                }
            }
        });
        if (!enrollment) {
            res.status(404).json({
                success: false,
                message: "Course not found or user not enrolled"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: enrollment
        });
    }
    catch (error) {
        console.error('Error fetching course learning details:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching course details"
        });
    }
};
exports.getCourseLearningDetails = getCourseLearningDetails;
const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        // Get course progress
        const progress = await app_1.prisma.courseProgress.findFirst({
            where: {
                userId,
                courseId
            },
            include: {
                completedVideos: {
                    select: {
                        id: true
                    }
                }
            }
        });
        // Get total videos in course
        const course = await app_1.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                sections: {
                    include: {
                        subSections: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found"
            });
            return;
        }
        const totalVideos = course.sections.reduce((total, section) => total + section.subSections.length, 0);
        res.status(200).json({
            success: true,
            data: {
                completedVideos: (progress === null || progress === void 0 ? void 0 : progress.completedVideos.map(v => v.id)) || [],
                totalVideos
            }
        });
    }
    catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching course progress"
        });
    }
};
exports.getCourseProgress = getCourseProgress;
const markVideoComplete = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { subSectionId } = req.body;
        const userId = req.user.id;
        // Get or create course progress
        let progress = await app_1.prisma.courseProgress.findFirst({
            where: {
                userId,
                courseId
            }
        });
        if (!progress) {
            progress = await app_1.prisma.courseProgress.create({
                data: {
                    userId,
                    courseId
                }
            });
        }
        // Mark video as completed
        await app_1.prisma.courseProgress.update({
            where: {
                id: progress.id
            },
            data: {
                completedVideos: {
                    connect: {
                        id: subSectionId
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "Video marked as completed"
        });
    }
    catch (error) {
        console.error('Error marking video as complete:', error);
        res.status(500).json({
            success: false,
            message: "Error updating progress"
        });
    }
};
exports.markVideoComplete = markVideoComplete;
