"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
interface StylisButtonProps {
  text: string | React.ReactNode;
  onClick?: () => void; 
  disabled?: boolean;
}

export const StylisButton: React.FC<StylisButtonProps> = ({ onClick, text, disabled }) => {
 
  return (
    <div className=" flex justify-center text-center">
      <HoverBorderGradient
      
        containerClassName="rounded-full"
        as="button"
        className={`dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 mx-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
      >
       
       {text}
      </HoverBorderGradient>
    </div>
  );
}

