import { Request, Response } from 'express'
import { PrismaClient, AccountType } from '@prisma/client'
import { uploadImageToCloudinary } from '../utils/imageUploader'
import { AuthRequest } from '../types/express'

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: AccountType;
  };
  file?: Express.Multer.File;
}

const prisma = new PrismaClient()

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { password, token, resetPasswordExpires, ...userInfo } = user;

    res.status(200).json({
      success: true,
      data: userInfo,
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      contactNumber,
      gender,
      dateOfBirth,
      about,
    } = req.body;

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(
        req.file.path,
        'profile-pictures'
      );
    }

    const updatedUser = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          contactNumber,
          ...(imageUrl && { image: imageUrl }),
        },
      });

      const profile = await prisma.profile.update({
        where: { id: user.profileId },
        data: {
          gender,
          dateOfBirth,
          about,
        },
      });

      return { ...user, profile };
    });

    const { password, token, resetPasswordExpires, ...userInfo } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userInfo,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

export const uploadProfileImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
      return;
    }

    const imageUrl = await uploadImageToCloudinary(
      req.file.path,
      'profile-pictures'
    );

    if (!imageUrl) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
      return;
    }

    res.status(200).json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
};
