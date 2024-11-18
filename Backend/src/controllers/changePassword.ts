import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { ChangePasswordInput } from '../types/user';
import { sendMail } from '../utils/mailSender';
import { prisma } from '../app';

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { oldPassword, newPassword, confirmNewPassword }: ChangePasswordInput = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
       res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
       res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
       res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
      return;
    }

    if (oldPassword === newPassword) {
       res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
      return;
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

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    next(error);
  }
};
