"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { BottomGradient } from "./effects/BotttomGradient";
import { LabelInputContainer } from "./inputContainer/InputConatiner";

export function LoginForm() {

   const [firstName , setFirstName ] = useState("")
   const [password , setPassword ] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <main className="flex justify-center items-center ">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-40">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex justify-center">
          Welcome to NoteWrite
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 flex justify-center">
          Enter your Credentials to access you account
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              onChange={ (e) => {setFirstName(e.target.value)}}
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

          <button
            className="bg-gradient-to-br mt-8 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign in &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </main>
  );
}
