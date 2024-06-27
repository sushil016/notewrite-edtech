"use client";

import Image from "next/image";
import React, { useState } from "react";
import { LabelInputContainer } from "../inputContainer/InputConatiner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { BottomGradient } from "../effects/BotttomGradient";
import Navbar from "../Navbar";
import { IoCall, IoChatbubblesSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

const Contactus = () => {

   const [firstName , setFirstName ] = useState("");
   const [lastName , setLastName ] = useState("");
   const [email , setEmail] = useState("");
   const [phoneNumber , setPhoneNumber] = useState("");
   const [message , setMessage ] = useState("");

   function SubmiContactUsHandler(){
    
   }
   
  return (
    <>
      <main className="w-full h-auto flex">
        <div className=" w-4/6 flex items-center  justify-end mt-[5rem]">
          <div className="bg-black flex flex-col justify-center w-[400px] h-[400px] rounded-lg p-8 gap-8">
            <div className=" flex flex-col">
              <div className="flex gap-2 items-center ">
                <div className="  p-2">
                  <IoChatbubblesSharp />
                </div>

                <h1 className="font-bold text-xl">Chat with us</h1>
              </div>
              <div className="flex flex-col ml-2">
                <p className="text-neutral-600 text-sm max-w-sm mt-1 dark:text-neutral-300">
                  Our friendly team is here to help.
                </p>
                <h2 className="font-semibold text-zinc-400">
                  notewrite.bvcoenm@gmail.con
                </h2>
              </div>
            </div>
            <div className=" flex flex-col">
              <div className="flex gap-2 items-center ">
                <div className="  p-2">
                  <IoCall />
                </div>

                <h1 className="font-bold text-xl">Visit us</h1>
              </div>
              <div className="flex flex-col ml-2">
                <p className="text-neutral-600 text-sm max-w-sm mt-1 dark:text-neutral-300">
                  Come and say hello at our office HQ.
                </p>
                <h2 className="font-semibold text-sm text-zinc-400">
                  Bharati Vidyapeeth College of Engineering, Navi Mumbai
                </h2>
              </div>
            </div>
            <div className=" flex flex-col">
              <div className="flex gap-2 items-center ">
                <div className="  p-2">
                  <FaLocationDot />
                </div>

                <h1 className="font-bold text-xl">Call us</h1>
              </div>
              <div className="flex flex-col ml-2">
                <p className="text-neutral-600 text-sm max-w-sm mt-1 dark:text-neutral-300">
                  Anytime{" "}
                </p>
                <h2 className="font-semibold text-zinc-400">+91 7007115675</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-screen w-[1px] ml-32" />
        <div className="flex justify-center items-center w-full mt-24">
          <div className="bg-black px-28 p-4 rounded-lg">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 items-center justify-center flex">
              Contact us
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 flex justify-center">
              Fell free to mail us if you are finding any dificulties
            </p>

            <form onSubmit={SubmiContactUsHandler}>
            <LabelInputContainer className="mt-6">
              <Label htmlFor="firstname">First Name</Label>
              <Input onChange={ (e)=>{setFirstName(e.target.value)}} id="firstname" placeholder="Firstname" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="mt-2">
              <Label onChange={ (e)=>{setLastName(e.target.value)}} htmlFor="lastname">Last Name</Label>
              <Input id="lastname" placeholder="Lastname" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="mt-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                onChange={ (e)=>{setEmail(e.target.value)}}
                id="email"
                placeholder="notewrite.bvcoenm@gmail.com"
                type="email"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mt-2">
              <Label htmlFor="PhoneNumber">Phone Number</Label>
              <Input
              onChange={ (e)=>{setPhoneNumber(e.target.value)}}
                id="phoneNumber"
                placeholder="Enter your Mobile Number"
                type="Number"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mt-2">
              <Label htmlFor="message">Write your message</Label>
              <textarea
              onChange={(e)=>{setMessage(e.target.value)}}
                className="rounded-lg bg-zinc-800 p-2"
                name="message"
                id="message"
              ></textarea>
            </LabelInputContainer>

            <button
              className="mt-6 mb-2 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Submit your message &rarr;
              <BottomGradient />
            </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contactus;


