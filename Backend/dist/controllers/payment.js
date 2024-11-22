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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.capturePayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const mailSender_1 = require("../utils/mailSender");
const emailTemplates_1 = require("../utils/emailTemplates");
const app_1 = require("../app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Check if required environment variables are present
// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
//     throw new Error('RAZORPAY_KEY_ID and RAZORPAY_SECRET must be present in environment variables');
// }
// Initialize Razorpay with type assertion
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
const capturePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        // Get course details including price
        const course = yield app_1.prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                courseName: true,
                price: true,
                teacherId: true
            }
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found"
            });
            return;
        }
        // Handle free courses directly
        if (course.price === 0) {
            // Directly enroll user in the course
            yield app_1.prisma.course.update({
                where: { id: courseId },
                data: {
                    students: {
                        connect: { id: userId }
                    }
                }
            });
            res.status(200).json({
                success: true,
                message: "Enrolled successfully in free course"
            });
            return;
        }
        // For paid courses, create Razorpay order
        const options = {
            amount: Math.max(100, Math.round(course.price * 100)), // Minimum 1 INR (100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId,
                userId
            }
        };
        const order = yield razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error processing payment"
        });
    }
});
exports.capturePayment = capturePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        // Get the order details from Razorpay
        const order = yield razorpay.orders.fetch(razorpay_order_id);
        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
            return;
        }
        // Enroll student in the course
        yield app_1.prisma.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: { id: req.user.id }
                }
            }
        });
        // Create course progress entry
        yield app_1.prisma.courseProgress.create({
            data: {
                userId: req.user.id,
                courseId: courseId,
            }
        });
        // Send enrollment confirmation email
        const user = yield app_1.prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                profile: true
            }
        });
        const course = yield app_1.prisma.course.findUnique({
            where: { id: courseId }
        });
        if (user && course) {
            yield (0, mailSender_1.sendMail)({
                email: user.email,
                subject: "Course Enrollment Successful",
                text: (0, emailTemplates_1.courseEnrollmentTemplate)(user.firstName, course.courseName)
            });
        }
        res.status(200).json({
            success: true,
            message: "Payment verified and enrollment successful"
        });
    }
    catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
});
exports.verifyPayment = verifyPayment;
