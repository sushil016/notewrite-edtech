"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Router } from "next/router";
import Link from "next/link";


export function StylisButton() {
 
  return (
    <Link href={'/signup'}  className=" flex justify-center text-center">
      <HoverBorderGradient
      
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 mx-3"
      >
       
        <span>Get Started &rarr;</span>
      </HoverBorderGradient>
    </Link>
  );
}

