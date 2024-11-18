"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCourse = async (req, res, next) => {
    var _a;
    try {
        const { courseName, courseDescription, whatYouWillLearn, tag, categoryId, instructions } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
