'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/profile');
      setProfile(response.data.data);
    } catch (error) {
      toast.error('Error fetching profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : profile ? (
            <div className="bg-black p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4">Profile</h1>
              <div className="space-y-4">
                {profile.avatar && (
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-400">{profile.email}</p>
                </div>
                {profile.bio && (
                  <div>
                    <h3 className="text-md font-semibold">Bio</h3>
                    <p className="text-gray-300">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>No profile data found</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
