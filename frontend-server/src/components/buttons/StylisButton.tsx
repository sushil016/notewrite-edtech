"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";


export function StylisButton() {


  return (
    <div  className=" flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 mx-3"
      >
       
        <span>Get Started &rarr;</span>
      </HoverBorderGradient>
    </div>
  );
}

