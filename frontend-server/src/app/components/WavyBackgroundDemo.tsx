"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";
import { TypewriteEffect } from "./TypewriteEffect";
import Navbar from "./Navbar";


export function WavyBackgroundDemo() {
  return (
    <>
     
    <WavyBackground className="max-w-4xl mx-auto pb-40">
    
        <div >
        <TypewriteEffect/>
        </div>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        </p>
      </WavyBackground>
    </>
    
  );
}
