"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategory = async (req, res, next) => {
    var _a;
    try {
        const { name, description } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
        if (!name || !description) {
            res.status(400).json({
                success: false,
                message: "Name and description are required"
            });
            return;
        }
        // Check if category with same name exists
        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });
        if (existingCategory) {
            res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
            return;
        }
        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        });
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    }
    catch (error) {
        console.error("Category creation error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Error creating category"
        });
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                courses: {
                    select: {
                        id: true,
                        courseName: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories"
        });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                courses: true
            }
        });
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching category"
        });
    }
};
exports.getCategoryById = getCategoryById;
