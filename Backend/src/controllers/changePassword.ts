import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ChangePasswordInput } from '../types/user';
import { sendMail } from '../utils/mailSender';

const prisma = new PrismaClient();

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword }: ChangePasswordInput = req.body;
    const userId = (req as any).user.id; // Assuming you have authentication middleware

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Send password update notification email
    await sendMail({
      email: user.email,
      subject: "Password Updated Successfully",
      text: "Your password has been successfully updated. If you didn't make this change, please contact support immediately.",
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};
