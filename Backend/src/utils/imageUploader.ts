import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImageToCloudinary = async (localFilePath: string, folder: string) => {
  try {
    if (!localFilePath) return null

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
    })

    // Remove file from local storage
    fs.unlinkSync(localFilePath)

    return response.secure_url
  } catch (error) {
    // Remove file from local storage if upload fails
    fs.unlinkSync(localFilePath)
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
} 