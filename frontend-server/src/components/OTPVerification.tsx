"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { BottomGradient } from "./effects/BotttomGradient";
import Heading from "./headersComponent/Heading";
import SubHeading from "./headersComponent/SubHeading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from '@/lib/axios';
import Cookies from 'js-cookie';

export function OTPVerification() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setUser } = useAuth();

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
            
            console.log('Sending signup data:', {
                ...signupData,
                otp,
                password: '***'
            });

            if (!signupData.email || !signupData.password || !otp) {
                throw new Error('Missing required data');
            }

            const requestData = {
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                email: signupData.email,
                password: signupData.password,
                contactNumber: signupData.contactNumber,
                accountType: signupData.accountType,
                otp: otp.trim()
            };

            const response = await axiosInstance.post('/auth/signup', requestData);

            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                Cookies.set('token', token, { expires: 1 });
                
                setUser(user);
                sessionStorage.removeItem('signupData');
                sessionStorage.removeItem('otpTimestamp');

                switch (user.accountType) {
                    case 'ADMIN':
                        router.push('/admin/dashboard');
                        break;
                    case 'TEACHER':
                        router.push('/teacher/dashboard');
                        break;
                    case 'STUDENT':
                    default:
                        router.push('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Signup error:', {
                error,
                response: error.response?.data,
                status: error.response?.status
            });
            
            const errorMessage = error.response?.data?.message || 
                               error.friendlyMessage || 
                               'Failed to verify OTP';
            setError(errorMessage);
            
            if (errorMessage.includes('No OTP found') || errorMessage.includes('Invalid OTP')) {
                setError(errorMessage);
            } else {
                sessionStorage.removeItem('signupData');
                router.push('/signup');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const signupData = JSON.parse(sessionStorage.getItem('signupData') || '{}');
            if (!signupData.email) {
                throw new Error('Email not found');
            }

            const response = await axiosInstance.post('/auth/send-otp', {
                email: signupData.email
            });

            if (response.data.success) {
                alert("New OTP has been sent to your email!");
                sessionStorage.setItem('otpTimestamp', Date.now().toString());
                setOtp('');
            }
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