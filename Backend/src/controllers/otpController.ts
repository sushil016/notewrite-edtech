import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import otpGenerator from 'otp-generator';
import { sendMail } from '../utils/mailSender';
import { otpVerificationTemplate } from '../utils/emailTemplates';

const prisma = new PrismaClient();

export const sendOTP: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

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

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Delete any existing OTPs for this email
    await prisma.oTP.deleteMany({
      where: { email },
    });

    // Save new OTP
    const otpDoc = await prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send email with the new template
    await sendMail({
      email,
      subject: "Verify Your Email - Notewrite",
      html: otpVerificationTemplate(otp)
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the most recent OTP for this email
    const otpRecord = await prisma.oTP.findFirst({
      where: { 
        email,
        expiresAt: {
          gt: new Date(), // OTP hasn't expired
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
       res.status(400).json({
        success: false,
        message: "OTP has expired or doesn't exist",
      });
      return;
    }

    if (otpRecord.otp !== otp) {
       res.status(400).json({
        success: false,
        message: "Invalid OTP on otp verification page",
      });
      return;
    }

    // Delete the used OTP
    // await prisma.oTP.delete({
    //   where: { id: otpRecord.id },
    // });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully go to signup page",
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
