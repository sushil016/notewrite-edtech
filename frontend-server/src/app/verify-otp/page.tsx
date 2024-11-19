"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MovingButton } from '@/components/ui/moving-border';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const [signupData, setSignupData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Get signup data from session storage
    const data = sessionStorage.getItem('signupData');
    const timestamp = sessionStorage.getItem('otpTimestamp');
    
    if (!data || !timestamp) {
      router.push('/signup');
      return;
    }

    // Check if OTP session is expired (5 minutes)
    if (Date.now() - parseInt(timestamp) > 300000) {
      sessionStorage.removeItem('signupData');
      sessionStorage.removeItem('otpTimestamp');
      router.push('/signup');
      return;
    }

    setSignupData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/auth/send-otp', {
        email: signupData.email
      });

      if (response.data.success) {
        toast.success('OTP resent successfully');
        setCountdown(300);
        setCanResend(false);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsRedirecting(false);

    try {
      if (!otp) {
        throw new Error('Please enter OTP');
      }

      // First verify OTP
      const verifyResponse = await axiosInstance.post('/auth/verify-otp', {
        email: signupData.email,
        otp
      });

      if (verifyResponse.data.success) {
        // Format the signup data
        const formattedSignupData = {
          firstName: signupData.firstName.trim(),
          lastName: signupData.lastName.trim(),
          email: signupData.email.trim().toLowerCase(),
          password: signupData.password,
          contactNumber: signupData.contactNumber.trim(),
          accountType: signupData.accountType,
          otp: otp.trim()
        };

        console.log('Sending signup data:', formattedSignupData); // Debug log

        // If OTP is verified, proceed with signup
        const signupResponse = await axiosInstance.post(
          '/auth/signup',
          formattedSignupData
        );

        if (signupResponse.data.success) {
          setIsRedirecting(true);
          toast.success('Account created successfully!');
          
          // Store the token
          if (signupResponse.data.token) {
            document.cookie = `token=${signupResponse.data.token}; path=/`;
          }
          
          // Clear session storage
          sessionStorage.removeItem('signupData');
          sessionStorage.removeItem('otpTimestamp');
          
          // Add a small delay before redirect
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Redirect based on account type
          switch (signupData.accountType) {
            case 'ADMIN':
              router.push('/admin/dashboard');
              break;
            case 'TEACHER':
              router.push('/teacher/dashboard');
              break;
            case 'STUDENT':
            default:
              router.push('/');
          }
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error); // Debug log
      setError(error.response?.data?.message || 'Verification failed');
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Redirecting to signup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Verify Your Email</h2>
        <p className="text-gray-300 mb-2">
          Please enter the verification code sent to
        </p>
        <p className="text-blue-400 font-medium mb-6">{signupData.email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-white/5 border-white/10 text-white"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="text-center text-gray-300 text-sm">
            Time remaining: {formatTime(countdown)}
          </div>

          <MovingButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </MovingButton>

          {canResend && (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resend OTP
            </button>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/signup')}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            ← Back to Signup
          </button>
        </div>
      </div>
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white">Redirecting to dashboard...</div>
        </div>
      )}
    </div>
  );
} 