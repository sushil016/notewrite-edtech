import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/passwordUtils'

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    accountType: string;
  };
}

const prisma = new PrismaClient()

export const getUserSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId,
          theme: 'dark',
          fontSize: 'medium',
          notifications: {
            email: true,
            push: false,
            updates: true,
            marketing: false,
          },
          privacy: {
            profileVisibility: 'public',
            twoFactorEnabled: false,
          },
        },
      })

     res.status(200).json({
        success: true,
        data: defaultSettings,
      })
      return;
    }

   res.status(200).json({
      success: true,
      data: settings,
    })
    return;
  } catch (error) {
    console.error('Error in getUserSettings:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
    return;
  }
}

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id
    const { theme, fontSize, notifications, privacy } = req.body

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        theme,
        fontSize,
        notifications,
        privacy,
      },
      create: {
        userId,
        theme,
        fontSize,
        notifications,
        privacy,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings,
    })
  } catch (error) {
    console.error('Error in updateSettings:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    })
  }
}

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Error in updatePassword:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
    })
  }
} 