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
exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingCategory = yield prisma.category.findUnique({
            where: { name }
        });
        if (existingCategory) {
            res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
            return;
        }
        const category = yield prisma.category.create({
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
});
exports.createCategory = createCategory;
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany({
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
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const category = yield prisma.category.findUnique({
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
});
exports.getCategoryById = getCategoryById;
