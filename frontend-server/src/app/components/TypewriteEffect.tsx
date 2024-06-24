"use client";

import Navbar from "./Navbar";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

export function TypewriteEffect() {
  const words = [
    {
      text: "Engineering",
    },
    {
      text: "are",
    },
    {
      text: "awesome",
    },
    {
      text: "with",
    },
    {
      text: "NoteWrite",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <>
    
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
    
        <p className="text-neutral-400 dark:text-neutral-100 text-xl sm:text-base  ">
          HELLO! I am Sushil
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-16 md:space-y-0 space-x-0 md:space-x-4">
          {/* <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
            Join now
          </button> */}
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            Get Started
          </button>
        </div>
      </div></>
  );
}
