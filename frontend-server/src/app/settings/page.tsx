'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MovingButton } from '@/components/ui/moving-border'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Define a type for notification keys
type NotificationKeys = 'email' | 'push' | 'updates' | 'marketing';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account')
  const [notifications, setNotifications] = useState<Record<NotificationKeys, boolean>>({
    email: true,
    push: false,
    updates: true,
    marketing: false
  })
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('medium')

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: '👤' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' }
  ]

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 p-8 pt-24">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="flex gap-6">
          {/* Animated Sidebar */}
          <motion.div 
            className="w-1/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content with AnimatePresence */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                className="bg-neutral-800/50 rounded-xl p-6"
              >
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Your username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Current Password</Label>
                      <Input id="password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <MovingButton>
                      <button className="bg-primary text-white px-6 py-2 rounded-lg">
                        <span>Save Changes</span>
                      </button>
                    </MovingButton>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Two-Factor Authentication</Label>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-primary rounded-lg text-white"
                        >
                          Enable 2FA
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Profile Visibility</Label>
                        <select className="bg-neutral-700 rounded-lg px-3 py-2">
                          <option>Public</option>
                          <option>Private</option>
                          <option>Friends Only</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Data Usage</Label>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-500 rounded-lg text-white"
                        >
                          Delete Account
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
                    {Object.entries(notifications).map(([key, value]) => (
                      <motion.div
                        key={key}
                        className="flex items-center justify-between"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Label>{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</Label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => setNotifications(prev => ({...prev, [key as NotificationKeys]: !prev[key as NotificationKeys]}))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>Theme</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {['light', 'dark'].map((themeOption) => (
                            <motion.button
                              key={themeOption}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTheme(themeOption)}
                              className={`p-4 rounded-lg ${
                                theme === themeOption
                                  ? 'bg-primary text-white'
                                  : 'bg-neutral-700 text-gray-300'
                              }`}
                            >
                              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Font Size</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {['small', 'medium', 'large'].map((size) => (
                            <motion.button
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFontSize(size)}
                              className={`p-2 rounded-lg ${
                                fontSize === size
                                  ? 'bg-primary text-white'
                                  : 'bg-neutral-700 text-gray-300'
                              }`}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage
