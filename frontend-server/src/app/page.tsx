"use client"
import { BottomGradient } from "@/components/effects/BotttomGradient";
import Line from "@/components/effects/Line";
import Navbar from "@/components/Navbar";
import { TypewriteEffect } from "@/components/TypewriteEffect";
import { useEffect } from "react";

export default function Home() {

  // useEffect( ()=>{
  //   (
  //     async ()=>{
  //       const LocomotiveScroll = (await import('locomotive-scroll')).default
  //       const locomotiveScroll = new LocomotiveScroll();
  //     }
  //   )()
  // },[])
  return (
    <div>
      <div className="w-full  z-50">{/* <Navbar/> */}</div>
      {/* <div><WavyBackgroundDemo/></div> */}

      <div className=" w-full ">
        <TypewriteEffect />
      </div>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="w-full h-screen bg-slate-800">hii</div>
      <div className="w-full h-screen bg-slate-500">hii</div>
      <BottomGradient/>
    </div>
  );
}
