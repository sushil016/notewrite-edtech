"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSectionsByCourse = exports.deleteSection = exports.updateSection = exports.createSection = void 0;
const app_1 = require("../app");
const createSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const course = yield app_1.prisma.course.findFirst({
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
        const section = yield app_1.prisma.section.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating section"
        });
    }
});
exports.createSection = createSection;
const updateSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const section = yield app_1.prisma.section.findFirst({
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
        const updatedSection = yield app_1.prisma.section.update({
            where: { id: sectionId },
            data: { sectionName }
        });
        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating section"
        });
    }
});
exports.updateSection = updateSection;
const deleteSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId } = req.params;
        const teacherId = req.user.id;
        // Verify the section belongs to a course owned by the teacher
        const section = yield app_1.prisma.section.findFirst({
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
        yield app_1.prisma.subSection.deleteMany({
            where: {
                sectionId: sectionId
            }
        });
        // Then delete the section
        yield app_1.prisma.section.delete({
            where: {
                id: sectionId
            }
        });
        res.status(200).json({
            success: true,
            message: "Section and its subsections deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting section"
        });
    }
});
exports.deleteSection = deleteSection;
const getSectionsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;
        // Verify the course belongs to the teacher
        const sections = yield app_1.prisma.section.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching sections"
        });
    }
});
exports.getSectionsByCourse = getSectionsByCourse;
