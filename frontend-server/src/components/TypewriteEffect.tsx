"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { StylisButton } from "./buttons/StylisButton";
import { Spinner } from "./ui/Spinner";

export function TypewriteEffect() {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState({
    signup: false,
    instructor: false
  });

  const handleNavigation = async (path: string, type: 'signup' | 'instructor') => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    try {
      await navigate.push(path);
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

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
      <div className="flex flex-col items-center h-[30rem] text-xl sm:text-base ">
        <p className="text-neutral-400 dark:text-neutral-100 text-xl sm:text-base mt-[11rem] ">
          Team NoteWrite HERE!
        </p>
        <TypewriterEffectSmooth words={words} />

        <div className="flex flex-col md:flex-row space-y-16 md:space-y-0 space-x-0 md:space-x-4 ">
          <div className="flex sm:flex-row flex-col sm:gap-4 md:gap-8 text-sm md:text-base gap-4">
            <StylisButton 
              onClick={() => handleNavigation('/signup', 'signup')} 
              text={<span>{isLoading.signup ? <Spinner /> : "Get Started →"}</span>}
              disabled={isLoading.signup || isLoading.instructor}
            />
            <StylisButton 
              onClick={() => handleNavigation('/signup-instructor', 'instructor')} 
              text={<span>{isLoading.instructor ? <Spinner /> : "Become an Instructor →"}</span>}
              disabled={isLoading.signup || isLoading.instructor}
            />
          </div>
        </div>    
        <div className="mt-24 gap-8">
          <button
            onClick={() => {
              navigate.push(
                "https://x.com/Sushil_Sahani37?t=zyiO3kvkcvORJMSkmqI45g&s=09"
              );
            }}
            className=" hover:scale-150 duration-300 px-4"
          >
            <FaXTwitter />
          </button>

          <button
            onClick={() => {
              navigate.push(
                "https://www.instagram.com/sushil______16?igsh=MW52cTl1ZTlvODk1dw=="
              );
            }}
            className="hover:scale-150 duration-300 px-4"
          >
            <FaInstagram />
          </button>
          <button
            onClick={() => {
              navigate.push(
                "https://www.linkedin.com/in/sushil-sahani-46235527b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              );
            }}
            className=" hover:scale-150 duration-300 px-4"
          >
            <FaLinkedin />
          </button>
        </div>
      </div>
    </>
  );
}
