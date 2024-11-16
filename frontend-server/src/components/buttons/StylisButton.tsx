"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Router } from "next/router";
import Link from "next/link";
interface StylisButtonProps {
  text: string;
  onClick?: () => void; // Add this line to accept onClick prop
}

export function StylisButton({text,onClick}:StylisButtonProps) {
 
  return (
    <div className=" flex justify-center text-center">
      <HoverBorderGradient
      
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 mx-3"
        onClick={onClick}
      >
       
        <span>{text}</span>
      </HoverBorderGradient>
    </div>
  );
}

