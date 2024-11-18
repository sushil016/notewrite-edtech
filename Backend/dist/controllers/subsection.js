"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubSection = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const prisma = new client_1.PrismaClient();
const createSubSection = async (req, res) => {
    var _a;
    try {
        const { sectionId, title, description, timeDuration } = req.body;
        const videoFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.videoFile;
        if (!sectionId || !title || !description || !timeDuration || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        // Upload video to Cloudinary
        const videoUpload = await (0, cloudinary_1.uploadToCloudinary)(videoFile, 'course_videos');
        const subSection = await prisma.subSection.create({
            data: {
                title,
                description,
                timeDuration,
                videoUrl: videoUpload.secure_url,
                section: {
                    connect: { id: sectionId }
                }
            }
        });
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: subSection
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating subsection"
        });
    }
};
exports.createSubSection = createSubSection;
