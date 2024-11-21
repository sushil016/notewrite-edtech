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
exports.deleteNote = exports.deleteSubSection = exports.updateSubSection = exports.createSubSection = void 0;
const app_1 = require("../app");
const cloudinary_1 = require("../utils/cloudinary");
const createSubSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, description, timeDuration, sectionId } = req.body;
        const teacherId = req.user.id;
        if (!title || !description || !timeDuration || !sectionId || !((_a = req.files) === null || _a === void 0 ? void 0 : _a.video)) {
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
        // Upload video to cloudinary
        const videoResult = yield (0, cloudinary_1.uploadToCloudinary)(req.files.video[0].path, 'course-videos');
        if (!videoResult) {
            res.status(500).json({
                success: false,
                message: "Error uploading video"
            });
            return;
        }
        // Upload PDF if present and initialize notesUrls array
        let notesUrls = [];
        if ((_b = req.files.notes) === null || _b === void 0 ? void 0 : _b[0]) {
            const notesResult = yield (0, cloudinary_1.uploadToCloudinary)(req.files.notes[0].path, 'course-notes');
            if (notesResult) {
                notesUrls.push(notesResult.secure_url);
            }
        }
        const subSection = yield app_1.prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: videoResult.secure_url,
                notesUrls: notesUrls || [],
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
});
exports.createSubSection = createSubSection;
const updateSubSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { title, description, timeDuration } = req.body;
        const { subSectionId } = req.params;
        const teacherId = req.user.id;
        // Verify ownership
        const subSection = yield app_1.prisma.subSection.findFirst({
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
        let videoUrl = subSection.videoUrl;
        if ((_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b[0]) {
            const videoResult = yield (0, cloudinary_1.uploadToCloudinary)(req.files.video[0].path, 'course-videos');
            if (videoResult) {
                videoUrl = videoResult.secure_url;
            }
        }
        // Handle multiple PDF uploads
        let notesUrls = subSection.notesUrls || [];
        if ((_c = req.files) === null || _c === void 0 ? void 0 : _c.notes) {
            const notePromises = req.files.notes.map(note => (0, cloudinary_1.uploadToCloudinary)(note.path, 'course-notes'));
            const noteResults = yield Promise.all(notePromises);
            const newNoteUrls = noteResults
                .filter(result => result !== null)
                .map(result => result.secure_url);
            notesUrls = [...notesUrls, ...newNoteUrls];
        }
        const updatedSubSection = yield app_1.prisma.subSection.update({
            where: { id: subSectionId },
            data: {
                title,
                description,
                timeDuration,
                videoUrl,
                notesUrls
            }
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
});
exports.updateSubSection = updateSubSection;
const deleteSubSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subSectionId } = req.params;
        const teacherId = req.user.id;
        // Verify the subsection belongs to a course owned by the teacher
        const subSection = yield app_1.prisma.subSection.findFirst({
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
        yield app_1.prisma.subSection.delete({
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
});
exports.deleteSubSection = deleteSubSection;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subSectionId } = req.params;
        const { noteUrl } = req.body;
        const teacherId = req.user.id;
        const subSection = yield app_1.prisma.subSection.findFirst({
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
        const updatedNotes = subSection.notesUrls.filter(url => url !== noteUrl);
        yield app_1.prisma.subSection.update({
            where: { id: subSectionId },
            data: {
                notesUrls: updatedNotes
            }
        });
        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting note"
        });
    }
});
exports.deleteNote = deleteNote;
