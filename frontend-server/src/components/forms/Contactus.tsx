"use client";

import Image from "next/image";
import React, { useState } from "react";
import { LabelInputContainer } from "../inputContainer/InputConatiner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { BottomGradient } from "../effects/BotttomGradient";
import { IoCall, IoChatbubblesSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

const Contactus = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  function SubmiContactUsHandler() {
    // Add your submit logic here
  }

  return (
    <main className="w-full min-h-screen px-4 py-8 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Info Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="bg-black rounded-lg p-8 w-full max-w-md space-y-8">
            {/* Chat Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2">
                  <IoChatbubblesSharp className="text-blue-400" />
                </div>
                <h1 className="font-bold text-xl">Chat with us</h1>
              </div>
              <div className="ml-2 space-y-1">
                <p className="text-neutral-600 text-sm dark:text-neutral-300">
                  Our friendly team is here to help.
                </p>
                <h2 className="font-semibold text-zinc-400">
                  notewrite.bvcoenm@gmail.com
                </h2>
              </div>
            </div>

            {/* Visit Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2">
                  <FaLocationDot className="text-blue-400" />
                </div>
                <h1 className="font-bold text-xl">Visit us</h1>
              </div>
              <div className="ml-2 space-y-1">
                <p className="text-neutral-600 text-sm dark:text-neutral-300">
                  Come and say hello at our Club HQ.
                </p>
                <h2 className="font-semibold text-sm text-zinc-400">
                  Bharati Vidyapeeth College of Engineering, Navi Mumbai
                </h2>
              </div>
            </div>

            {/* Call Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2">
                  <IoCall className="text-blue-400" />
                </div>
                <h1 className="font-bold text-xl">Call us</h1>
              </div>
              <div className="ml-2 space-y-1">
                <p className="text-neutral-600 text-sm dark:text-neutral-300">
                  Anytime
                </p>
                <h2 className="font-semibold text-zinc-400">+91 7007115675</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-start">
          <div className="bg-black p-8 rounded-lg w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Contact us
              </h2>
              <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
                Feel free to mail us if you are finding any difficulties
              </p>
            </div>

            <form onSubmit={SubmiContactUsHandler} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    onChange={(e) => setFirstName(e.target.value)}
                    id="firstname"
                    placeholder="Firstname"
                    type="text"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Lastname"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="notewrite.bvcoenm@gmail.com"
                  type="email"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="PhoneNumber">Phone Number</Label>
                <Input
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  id="phoneNumber"
                  placeholder="Enter your Mobile Number"
                  type="tel"
                  pattern="[0-9]*"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="message">Write your message</Label>
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[120px] rounded-lg bg-zinc-800 p-3 text-white resize-y"
                  name="message"
                  id="message"
                  placeholder="Your message here..."
                ></textarea>
              </LabelInputContainer>

              <button
                className="w-full bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Submit your message &rarr;
                <BottomGradient />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contactus;


