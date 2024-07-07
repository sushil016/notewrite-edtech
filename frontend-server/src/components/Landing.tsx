import React, { useRef } from "react";
import { TypewriteEffect } from "./TypewriteEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Source_Code_Pro } from "next/font/google";
import { useGSAP } from "@gsap/react";
import Testimonials from "./Testimonials";

const codepro = Source_Code_Pro({ weight: "400", subsets: ["latin"] });

const Landing = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const codeRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      codeRef.current,
      {
        opacity: 0,
        duration: 2,
        delay: 2,
      },
      {
        opacity: 1,
        duration: 1,
        delay: 1,
        y: 0,
        scale: 1.3,
        scrollTrigger: {
          trigger: codeRef.current,
          markers: true,
          scrub: true,
        },
      }
    );
  });

  return (
    <div>
      <div className=" w-full ">
        <TypewriteEffect />
      </div>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className={codepro.className}>
        {" "}
        <div ref={codeRef} className="w-full flex justify-center items-center">
          {" "}
          <p className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 inline-block    text-transparent bg-clip-text text-[3rem] ">
            All You Need You Get Here
          </p>
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Landing;
