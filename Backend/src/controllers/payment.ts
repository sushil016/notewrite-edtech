import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendMail } from '../utils/mailSender';
import { courseEnrollmentTemplate } from '../utils/emailTemplates';
import { AuthRequest } from '../types/express';
import { prisma } from '../app';

interface RazorpayOrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes: {
        courseId: string;
        userId: string;
    };
}

interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any;
    created_at: number;
}

interface VerifyPaymentBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    notes: {
        courseId: string;
        userId: string;
    };
}

// Add interface for request body
interface CapturePaymentBody {
    courseId: string;
}

type CapturePaymentRequest = AuthRequest & { body: CapturePaymentBody };
type VerifyPaymentRequest = AuthRequest & { body: VerifyPaymentBody };

// Check if required environment variables are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_SECRET must be present in environment variables');
}

// Initialize Razorpay with type assertion
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_SECRET as string
});

export const capturePayment = async (req: CapturePaymentRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Get course details including price
        const course = await prisma.course.findUnique({
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
            await prisma.course.update({
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
        const options: RazorpayOrderOptions = {
            amount: Math.max(100, Math.round(course.price * 100)), // Minimum 1 INR (100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId,
                userId
            }
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error processing payment"
        });
    }
};

export const verifyPayment = async (req: VerifyPaymentRequest, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, notes } = req.body;
        const { courseId, userId } = notes;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
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
            await sendMail({
                email: user.email,
                subject: "Course Enrollment Confirmation",
                html: courseEnrollmentTemplate(course.courseName, `${user.firstName} ${user.lastName}`)
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified and course enrollment completed"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
}; 