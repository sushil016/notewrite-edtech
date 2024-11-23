"use client";
import { Signup } from "@/components/Signup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's pending OTP verification
    const signupData = sessionStorage.getItem('signupData');
    if (signupData) {
      const data = JSON.parse(signupData);
      // Only redirect if OTP was recently sent (within last 5 minutes)
      const timestamp = sessionStorage.getItem('otpTimestamp');
      if (timestamp && Date.now() - parseInt(timestamp) < 300000) { // 5 minutes
        router.push('/verify-otp');
      } else {
        // Clear old signup data
        sessionStorage.removeItem('signupData');
        sessionStorage.removeItem('otpTimestamp');
      }
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-600 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <Signup />
    </main>
  );
}
