"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { useNavigate } from 'react-router-dom';

export function StylisButton() {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/signup")} className=" flex justify-center text-center">
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

