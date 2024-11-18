"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.capturePayment = void 0;
const client_1 = require("@prisma/client");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const mailSender_1 = require("../utils/mailSender");
const emailTemplates_1 = require("../utils/emailTemplates");
const prisma = new client_1.PrismaClient();
// Check if required environment variables are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_SECRET must be present in environment variables');
}
// Initialize Razorpay with type assertion
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
const capturePayment = async (req, res, next) => {
    var _a;
    try {
        const { courseId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
        if (!courseId) {
            res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
            return;
        }
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                students: {
                    none: {
                        id: userId
                    }
                }
            }
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found or user already enrolled"
            });
            return;
        }
        const options = {
            amount: 500 * 100,
            currency: "INR",
            receipt: `receipt_${courseId}`,
            notes: {
                courseId: courseId,
                userId: userId
            }
        };
        const order = await new Promise((resolve, reject) => {
            razorpay.orders.create(options, (err, order) => {
                if (err)
                    reject(err);
                else
                    resolve(order);
            });
        });
        res.status(200).json({
            success: true,
            message: "Order created successfully",
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
};
exports.capturePayment = capturePayment;
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const { courseId, userId } = req.body.notes;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex");
        if (razorpay_signature !== expectedSign) {
            res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
            return;
        }
        const [course, user] = await Promise.all([
            prisma.course.findUnique({ where: { id: courseId } }),
            prisma.user.findUnique({ where: { id: userId } })
        ]);
        if (!course || !user) {
            res.status(404).json({
                success: false,
                message: "Course or user not found"
            });
            return;
        }
        await prisma.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: { id: userId }
                }
            }
        });
        await prisma.courseProgress.create({
            data: {
                userId,
                courseId
            }
        });
        if (user.email) {
            await (0, mailSender_1.sendMail)({
                email: user.email,
                subject: "Course Enrollment Confirmation",
                html: (0, emailTemplates_1.courseEnrollmentTemplate)(course.courseName, `${user.firstName} ${user.lastName}`)
            });
        }
        res.status(200).json({
            success: true,
            message: "Payment verified and course enrollment completed"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
};
exports.verifyPayment = verifyPayment;
