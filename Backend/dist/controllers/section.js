"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSection = exports.updateSection = exports.createSection = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSection = async (req, res, next) => {
    try {
        const { sectionName, courseId } = req.body;
        if (!sectionName || !courseId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating section"
        });
    }
};
exports.createSection = createSection;
const updateSection = async (req, res, next) => {
    try {
        const { sectionName, sectionId } = req.body;
        if (!sectionName || !sectionId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating section"
        });
    }
};
exports.updateSection = updateSection;
const deleteSection = async (req, res, next) => {
    try {
        const { sectionId } = req.params;
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting section"
        });
    }
};
exports.deleteSection = deleteSection;
