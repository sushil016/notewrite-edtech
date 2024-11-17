'use client'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MovingBorder, MovingButton } from '@/components/ui/moving-border'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  gender: string
  dateOfBirth: string
  about: string
  image: string
}

const ProfileEditForm = ({ 
  initialData, 
  onSubmit 
}: {
  initialData: ProfileFormData
  onSubmit: (data: ProfileFormData) => void
}) => {
  const [formData, setFormData] = useState(initialData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      let updatedFormData = { ...formData }

      if (imageFile) {
        try {
          const imageFormData = new FormData()
          imageFormData.append('image', imageFile)
          
          const uploadResponse = await fetch('http://localhost:8000/api/profile/upload-image', {
            method: 'POST',
            credentials: 'include',
            body: imageFormData,
          })
          
          if (!uploadResponse.ok) {
            console.warn('Image upload failed, continuing with profile update')
          } else {
            const { imageUrl } = await uploadResponse.json()
            updatedFormData.image = imageUrl
          }
        } catch (imageError) {
          console.warn('Image upload failed, continuing with profile update:', imageError)
        }
      }
      
      const response = await fetch('http://localhost:8000/api/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      onSubmit(updatedFormData)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Phone Number</Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <textarea
          id="about"
          className="w-full min-h-[100px] bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white"
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          placeholder="Tell us about yourself"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Profile Picture (Optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image file size should be less than 5MB')
                e.target.value = '' // Clear the input
                return
              }
              setImageFile(file)
            }
          }}
        />
        <p className="text-sm text-gray-500">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF
        </p>
      </div>

      <MovingButton>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-primary text-white px-6 py-2 rounded-lg w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </MovingButton>
    </form>
  )
}

export default ProfileEditForm 