"use client";
import { Signup } from "@/components/Signup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";

const page = () => {
  const signupRef = useRef();
  const signupFormRef = useRef();


  useGSAP(
    ()=>{
      gsap.to(signupRef.current , {
        scale:1,
        delay:0.5,
        duration:2,
        opacity:0,
        
      })
    }
  )

  useGSAP( ()=>{
    gsap.from(signupFormRef.current , {
      opacity:50,
      delay:2,
      duration:2,
    })
  })
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <div className=" ">
        <div ref={signupRef} className="font-bold text-[23rem] text-blue-600 relative  ">
          SIGN UP
        </div>
        {/* <div ref={scrollRef} className="font-bold text-[10rem] rotate-90  flex justify-end ">SCROLL</div> */}
      </div>
      <div className="absolute text-black font-semibold"> <Signup ref={signupFormRef}/></div>
    </div>
  );
};

export default page;
