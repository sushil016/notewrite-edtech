"use client";
import { Signup } from "@/components/Signup";
import React from "react";

const page = () => {
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <div className="absolute text-black font-semibold mt-32"> <Signup /></div>
    </div>
  );
};

export default page;
