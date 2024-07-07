"use client";
import Landing from "@/components/Landing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

export default function Home() {
  return (
    <div>
      <Landing />
    </div>
  );
}
