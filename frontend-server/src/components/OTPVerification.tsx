"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { BottomGradient } from "./effects/BotttomGradient";
import Heading from "./headersComponent/Heading";
import SubHeading from "./headersComponent/SubHeading";
import axios from "axios";
import { useRouter } from "next/navigation";

export function OTPVerification() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verificationEmail');
        if (!storedEmail) {
            router.push('/signup');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/verify-otp', {
                email,
                otp
            });

            if (response.data.success) {
                // Clear the stored email
                sessionStorage.removeItem('verificationEmail');
                // Redirect to home page
                router.push('/');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Invalid OTP!");
        }
    };

    const handleResendOTP = async () => {
        try {
            await axios.post('/api/auth/resend-otp', { email });
            alert("New OTP has been sent to your email!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to resend OTP!");
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