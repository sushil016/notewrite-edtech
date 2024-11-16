"use client";
import React, { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { BottomGradient } from "./effects/BotttomGradient";
import Heading from "./headersComponent/Heading";
import SubHeading from "./headersComponent/SubHeading";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function SignupInstructor() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [expertise, setExpertise] = useState("")
    const [experience, setExperience] = useState("")
    const router = useRouter();

    function githubHandler(){
        signIn()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await axios.post('/api/auth/signup-instructor', {
                firstName,
                lastName,
                email,
                password,
                expertise,
                experience
            });

            if (response.data.success) {
                // Store email temporarily for OTP verification
                sessionStorage.setItem('verificationEmail', email);
                router.push('/verify-otp');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-2 md:p-8 backdrop-blur-sm shadow-lg shadow-zinc-100/10 drop-shadow-xs relative">
            <Heading value={'Join Robonauts as an Instructor'}/>
            <SubHeading value={'Enter your details to create your instructor account!'}/>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input onChange={(e)=>{setFirstName(e.target.value)}} id="firstname" placeholder="John" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input onChange={(e)=>{setLastName(e.target.value)}} id="lastname" placeholder="Doe" type="text" />
                    </LabelInputContainer>
                </div>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input onChange={(e)=>{setEmail(e.target.value)}} id="email" placeholder="instructor@example.com" type="email" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Input onChange={(e)=>{setExpertise(e.target.value)}} id="expertise" placeholder="e.g., Robotics, AI, Machine Learning" type="text" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input onChange={(e)=>{setExperience(e.target.value)}} id="experience" placeholder="e.g., 5" type="number" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input onChange={(e)=>{setPassword(e.target.value)}} id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="confirmpassword">Confirm Password</Label>
                    <Input
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        id="confirmpassword"
                        placeholder="••••••••"
                        type="password"
                    />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] text-xl"
                    type="submit"
                >
                    Sign up as Instructor &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="">
                    <button onClick={githubHandler}
                        className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="submit"
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
} 