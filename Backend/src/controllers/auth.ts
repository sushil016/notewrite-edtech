import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserInput } from '../types/user';
import { sendMail } from '../utils/mailSender';
import { prisma } from '../app';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      accountType,
      otp,
    } = req.body;

    console.log('Received signup data:', {
      firstName,
      lastName,
      email,
      contactNumber,
      accountType,
      otp,
      hasPassword: !!password
    });

    // Validation
    if (!firstName || !lastName || !email || !password || !contactNumber || !otp) {
      console.log('Missing required fields:', {
        hasFirstName: !!firstName,
        hasLastName: !!lastName,
        hasEmail: !!email,
        hasPassword: !!password,
        hasContactNumber: !!contactNumber,
        hasOTP: !!otp
      });
      res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
      return;
    }

    // Verify OTP
    const recentOTP = await prisma.oTP.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    console.log('OTP verification:', {
      receivedOTP: otp,
      storedOTP: recentOTP?.otp,
      email,
      otpCreatedAt: recentOTP?.createdAt
    });

    if (!recentOTP) {
      res.status(400).json({
        success: false,
        message: "No OTP found for this email go to signup page",
      });
      return;
    }

    if (recentOTP.otp !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP from signup page",
        debug: {
          receivedOTP: otp,
          storedOTP: recentOTP.otp
        }
      });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        gender: null,
        dateOfBirth: null,
        about: null,
      },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        accountType,
        profileId: profile.id,
      },
    });

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        accountType: user.accountType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate token with proper payload
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        accountType: user.accountType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set token in both cookie and response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountType: true,
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};