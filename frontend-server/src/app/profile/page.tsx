'use client'
import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { MovingBorder } from '@/components/ui/moving-border'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import { useUserProfile } from '@/hooks/useUserProfile'

const Profile = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView()
  const [isEditing, setIsEditing] = useState(false)
  const { userData, loading, error, refetch } = useUserProfile()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const words = [
    {
      text: "Welcome",
    },
    {
      text: userData?.firstName || "User",
    },
    {
      text: "!",
    },
  ]

  const getCompletionPercentage = () => {
    if (!userData) return 0
    const fields = [
      userData.profile.gender,
      userData.profile.dateOfBirth,
      userData.profile.about,
      userData.image,
    ]
    const filledFields = fields.filter(field => field).length
    return Math.round((filledFields / fields.length) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
      {/* Hero Section */}
      <div className="h-[40vh] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
        <TypewriterEffect words={words} />
      </div>

      {/* Profile Completion Alert */}
      {getCompletionPercentage() < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <div className="bg-primary/20 border border-primary rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary mb-2">Complete Your Profile</h3>
            <p className="text-gray-300 mb-4">
              Your profile is {getCompletionPercentage()}% complete. Fill in the missing information
              to get the most out of your account.
            </p>
            <div className="w-full bg-neutral-700 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 }
          }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-800/50 rounded-xl p-6 mb-8 relative"
        >
          {!isEditing ? (
            <>
              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-primary/20 text-primary px-4 py-2 rounded-lg"
              >
                Edit Profile
              </motion.button>

              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  {userData?.image ? (
                    <img
                      src={userData.image}
                      alt={`${userData.firstName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-4xl text-white">
                        {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {userData?.firstName} {userData?.lastName}
                  </h1>
                  <p className="text-gray-400">{userData?.accountType}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                    <p className="text-gray-400">Email: {userData?.email}</p>
                    <p className="text-gray-400">Phone: {userData?.contactNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                    <p className="text-gray-400">Gender: {userData?.profile.gender || 'Not set'}</p>
                    <p className="text-gray-400">Birth Date: {userData?.profile.dateOfBirth || 'Not set'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">About Me</h3>
                    <p className="text-gray-400">
                      {userData?.profile.about || 'Tell us about yourself'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <ProfileEditForm
              initialData={{
                firstName: userData?.firstName || '',
                lastName: userData?.lastName || '',
                email: userData?.email || '',
                contactNumber: userData?.contactNumber || '',
                gender: userData?.profile.gender || '',
                dateOfBirth: userData?.profile.dateOfBirth || '',
                about: userData?.profile.about || '',
                image: userData?.image || ''
              }}
              onSubmit={async (data) => {
                try {
                  const response = await fetch('/api/profile/update', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                  })
                  
                  if (!response.ok) throw new Error('Failed to update profile')
                  
                  await refetch()
                  setIsEditing(false)
                } catch (error) {
                  console.error('Error updating profile:', error)
                }
              }}
            />
          )}
        </motion.div>

        {/* Statistics Section for Teachers */}
        {userData?.accountType === 'TEACHER' && (
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral-800/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Teaching Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Courses', value: '0' },
                { label: 'Students', value: '0' },
                { label: 'Rating', value: 'N/A' }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-neutral-700/50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Profile
