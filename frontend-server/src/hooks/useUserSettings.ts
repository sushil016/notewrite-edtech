import { useState, useEffect } from 'react'

interface UserSettings {
  theme: string
  fontSize: string
  notifications: {
    email: boolean
    push: boolean
    updates: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: string
    twoFactorEnabled: boolean
  }
}

export const useUserSettings = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch settings')
      const { data } = await response.json()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const response = await fetch('/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to update settings')
      const { data } = await response.json()
      setSettings(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return { settings, loading, error, updateSettings, refetch: fetchSettings }
} 