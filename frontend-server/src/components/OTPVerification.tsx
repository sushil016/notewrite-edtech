"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { BottomGradient } from "./effects/BotttomGradient";
import Heading from "./headersComponent/Heading";
import SubHeading from "./headersComponent/SubHeading";
import { useRouter } from "next/navigation";
import axiosInstance from '@/lib/axios'; // Use the configured instance

export function OTPVerification() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const signupData = sessionStorage.getItem('signupData');
        if (!signupData) {
            router.push('/signup');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const signupData = JSON.parse(sessionStorage.getItem('signupData') || '{}');
            
            // Log the retrieved data
            console.log('Retrieved signup data:', {
                ...signupData,
                password: signupData.password ? '***' : 'undefined',
                confirmPassword: signupData.confirmPassword ? '***' : 'undefined'
            });

            // Validate the data before sending
            if (!signupData.password || !signupData.confirmPassword) {
                console.error('Missing password data:', {
                    hasPassword: !!signupData.password,
                    hasConfirmPassword: !!signupData.confirmPassword
                });
                throw new Error('Password data is missing. Please try signing up again.');
            }

            const requestData = {
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                email: signupData.email,
                password: signupData.password,
                confirmPassword: signupData.confirmPassword,
                contactNumber: signupData.contactNumber,
                accountType: signupData.accountType,
                otp: otp
            };

            // Log the exact data being sent
            console.log('Sending request data:', {
                ...requestData,
                password: '***',
                confirmPassword: requestData.confirmPassword ? '***' : 'undefined'
            });

            const response = await axiosInstance.post('/auth/signup', requestData);

            if (response.data.success) {
                sessionStorage.removeItem('signupData');
                sessionStorage.removeItem('otpTimestamp');
                alert('Signup successful! Please login.');
                router.push('/login');
            }
        } catch (error: any) {
            console.error('Signup error:', {
                error: error.message,
                response: error.response?.data,
                friendlyMessage: error.friendlyMessage
            });
            const errorMessage = error.response?.data?.message || error.friendlyMessage || 'Failed to verify OTP';
            setError(errorMessage);
            
            if (errorMessage.includes('password') || errorMessage.includes('Password')) {
                sessionStorage.removeItem('signupData');
                alert('Please try signing up again.');
                router.push('/signup');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const signupData = JSON.parse(sessionStorage.getItem('signupData') || '{}');
            await axiosInstance.post('/auth/send-otp', {
                email: signupData.email
            });
            alert("New OTP has been sent to your email!");
            sessionStorage.setItem('otpTimestamp', Date.now().toString());
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to resend OTP!");
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <Heading value="Verify Your Email" />
            <SubHeading value="Please enter the OTP sent to your email" />

            <form onSubmit={handleSubmit} className="my-8">
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Verify OTP
                    <BottomGradient />
                </button>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Resend OTP
                    </button>
                </div>
            </form>
        </div>
    );
} 