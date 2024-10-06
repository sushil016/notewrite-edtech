"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { BottomGradient } from "./effects/BotttomGradient";
import { LabelInputContainer } from "./inputContainer/InputConatiner";
import { useRouter } from "next/navigation";
import SubHeading from "./headersComponent/SubHeading";
import Heading from "./headersComponent/Heading";
import Link from "next/link";

export function LoginForm() {

   const [email , setEmail ] = useState("")
   const [password , setPassword ] = useState("")

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <main className="flex justify-center items-center ">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-40">
        
        <Heading value={'Welcome to Robonauts'}/>
        <SubHeading value={'Enter your Credentials to Access Your account'}/>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              onChange={ (e) => {setEmail(e.target.value)}}
              id="email"
              placeholder="notewrite.bvcoenm@gmail.com"
              type="email"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input 
            onChange={ (e) => {setPassword(e.target.value)}}
            id="password"
            placeholder="••••••••" 
            type="password" />
          </LabelInputContainer>

          <button onClick={ ()=>{ router.push('/forgot-password')}} className="flex text-blue-500 w-full justify-end text-sm pr-2 hover:text-blue-400"> Forgot Password</button>

          <button
            className="bg-gradient-to-br mt-6 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign in &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>

        <Link className="flex justify-center items-center hover:text-blue-500" href={'/signup'}> Dotnot have an account {" "} Sign-up </Link>
      </div>
    </main>
  );
}
