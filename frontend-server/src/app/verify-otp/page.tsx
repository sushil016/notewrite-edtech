"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { LabelInputContainer } from '../../components/inputContainer/InputConatiner';
import { BottomGradient } from '../../components/effects/BotttomGradient';
import Heading from '../../components/headersComponent/Heading';
import SubHeading from '../../components/headersComponent/SubHeading';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [signupData, setSignupData] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Get signup data from session storage
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      router.push('/signup');
      return;
    }
    setSignupData(JSON.parse(data));

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8000/api/v1/auth/send-otp', {
        email: signupData.email
      });

      if (response.data.success) {
        setCountdown(300); // Reset countdown
        alert('New OTP has been sent to your email');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!otp) {
        throw new Error('Please enter OTP');
      }

      if (countdown === 0) {
        throw new Error('OTP has expired. Please request a new one');
      }

      // Send signup data with OTP for verification
      const response = await axios.post('http://localhost:8000/api/v1/auth/signup', {
        ...signupData,
        otp
      });

      if (response.data.success) {
        sessionStorage.removeItem('signupData'); // Clear stored data
        router.push('/'); // Redirect to login page
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-600 ">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-lg bg-white dark:bg-gray-800">
        <Heading value="Verify Your Email" />
        <SubHeading value={`Enter the OTP sent to ${signupData.email}`} />

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              placeholder="Enter 6-digit OTP"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </LabelInputContainer>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Time remaining: {formatTime(countdown)}
            </p>
          </div>

          <button
            className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-xl ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading || countdown === 0}
          >
            {loading ? 'Verifying...' : 'Verify OTP →'}
            <BottomGradient />
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || countdown > 0}
              className={`text-blue-600 hover:text-blue-800 text-sm ${
                countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {countdown > 0 ? `Resend OTP in ${formatTime(countdown)}` : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP; 