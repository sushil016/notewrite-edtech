"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { BottomGradient } from "./effects/BotttomGradient";
import Heading from "./headersComponent/Heading";
import SubHeading from "./headersComponent/SubHeading";
import { useRouter } from "next/navigation";
import axiosInstance from '@/lib/axios';

export function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    accountType: "STUDENT", // default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.password || !formData.contactNumber) {
        throw new Error("Please fill all required fields");
      }

      // Send OTP
      const response = await axiosInstance.post('/auth/send-otp', {
        email: formData.email
      });
      
      if (response.data.success) {
        // Store complete signup data in session storage
        const dataToStore = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password, // Only use password
          contactNumber: formData.contactNumber.trim(),
          accountType: formData.accountType,
        };

        console.log('Data being stored:', {
          ...dataToStore,
          password: '***'
        });

        sessionStorage.setItem('signupData', JSON.stringify(dataToStore));
        sessionStorage.setItem('otpTimestamp', Date.now().toString());
        router.push('/verify-otp');
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || error.friendlyMessage || error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-2 md:p-8 md:pt-8 md:mt-24 mb-8 mt-0 backdrop-blur-sm shadow-lg shadow-zinc-100/40 drop-shadow-xs relative">
      <Heading value={'Welcome to NoteWrite'} />
      <SubHeading value={'Enter your Credentials to create your account!'} />

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            placeholder="1234567890"
            type="tel"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="accountType">Account Type</Label>
          <select
            id="accountType"
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md border border-gray-300"
            required
          >
            <option value="STUDENT">Student</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-xl ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up →'}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}






