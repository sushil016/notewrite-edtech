"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubSection = exports.updateSubSection = exports.createSubSection = void 0;
const app_1 = require("../app");
const cloudinary_1 = require("../utils/cloudinary");
const createSubSection = async (req, res) => {
    try {
        const { title, description, timeDuration, sectionId } = req.body;
        const teacherId = req.user.id;
        if (!title || !description || !timeDuration || !sectionId || !req.file) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
            return;
        }
        // Verify the section belongs to a course owned by the teacher
        const section = await app_1.prisma.section.findFirst({
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
        const uploadResponse = await (0, cloudinary_1.uploadToCloudinary)(req.file.path, 'course-videos');
        if (!uploadResponse || !uploadResponse.secure_url) {
            res.status(500).json({
                success: false,
                message: "Error uploading video"
            });
            return;
        }
        const subSection = await app_1.prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: uploadResponse.secure_url,
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating subsection"
        });
    }
};
exports.createSubSection = createSubSection;
const updateSubSection = async (req, res) => {
    try {
        const { title, description, timeDuration, subSectionId } = req.body;
        const teacherId = req.user.id;
        // Verify the subsection belongs to a course owned by the teacher
        const subSection = await app_1.prisma.subSection.findFirst({
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
        let videoUrl;
        if (req.file) {
            const uploadResponse = await (0, cloudinary_1.uploadToCloudinary)(req.file.path, 'course-videos');
            if (!uploadResponse || !uploadResponse.secure_url) {
                res.status(500).json({
                    success: false,
                    message: "Error uploading video"
                });
                return;
            }
            videoUrl = uploadResponse.secure_url;
        }
        const updatedSubSection = await app_1.prisma.subSection.update({
            where: { id: subSectionId },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (timeDuration && { timeDuration })), (videoUrl && { videoUrl }))
        });
        res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedSubSection
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating subsection"
        });
    }
};
exports.updateSubSection = updateSubSection;
const deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.params;
        const teacherId = req.user.id;
        // Verify the subsection belongs to a course owned by the teacher
        const subSection = await app_1.prisma.subSection.findFirst({
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
        await app_1.prisma.subSection.delete({
            where: { id: subSectionId }
        });
        res.status(200).json({
            success: true,
            message: "Subsection deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting subsection"
        });
    }
};
exports.deleteSubSection = deleteSubSection;
