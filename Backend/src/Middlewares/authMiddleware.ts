import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        accountType: AccountType;
    };
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        (req as AuthRequest).user = {
            id: user.id,
            email: user.email,
            accountType: user.accountType
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

export const isInstructor = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    if (authReq.user?.accountType !== AccountType.TEACHER) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Instructor only."
        });
    }
    next();
}; 