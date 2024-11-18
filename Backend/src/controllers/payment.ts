import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendMail } from '../utils/mailSender';
import { courseEnrollmentTemplate } from '../utils/emailTemplates';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

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

// Check if required environment variables are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_SECRET must be present in environment variables');
}

// Initialize Razorpay with type assertion
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_SECRET as string
});

export const capturePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { courseId } = req.body;
        const userId = (req as AuthRequest).user?.id;

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

        const options: RazorpayOrderOptions = {
            amount: 500 * 100,
            currency: "INR",
            receipt: `receipt_${courseId}`,
            notes: {
                courseId: courseId,
                userId: userId
            }
        };

        const order = await new Promise<RazorpayOrderResponse>((resolve, reject) => {
            razorpay.orders.create(options, (err, order) => {
                if (err) reject(err);
                else resolve(order as RazorpayOrderResponse);
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

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error processing payment"
        });
    }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const { courseId, userId } = req.body.notes;

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