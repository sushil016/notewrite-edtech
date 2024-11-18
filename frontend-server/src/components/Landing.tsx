"use client";
import React, { useRef, useEffect } from "react";
import { TypewriteEffect } from "./TypewriteEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Source_Code_Pro } from "next/font/google";
import { TopCoursesSection } from './courses/TopCoursesSection';
import { TestimonialsSection } from "./testimonials/TestimonialsSection";
import HomePageCard from "./HomePageCard";
import { courses, testimonials } from '../data/mockData';

const codepro = Source_Code_Pro({ weight: "400", subsets: ["latin"] });

const Landing = () => {
  const typewriteRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Pin TypewriteEffect until card reaches trigger point
    gsap.to(typewriteRef.current, {
      scrollTrigger: {
        trigger: typewriteRef.current,
        start: "top top",
        end: "+=50%",
        pin: true,
        pinSpacing: false,
      }
    });

    // Parallax effect for TypewriteEffect
    gsap.to(typewriteRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 70%", // Start when card reaches 50% viewport
        end: "top 20%",
        scrub: 1,
        onUpdate: (self) => {
          if (typewriteRef.current) {
            const progress = self.progress;
            // Parallax effect
            const yMove = -progress * 350; // Move down by 100px
            const scale = gsap.utils.interpolate(1, 0.8, progress);
            const blur = gsap.utils.interpolate(0, 3, progress);
            
            typewriteRef.current.style.transform = `translate3d(0, ${yMove}px, 0) scale(${scale})`;
            typewriteRef.current.style.filter = `blur(${blur}px)`;
            typewriteRef.current.style.opacity = `${1 - progress * 0.3}`;
          }
        },
      }
    });

    // HomePageCard animation
    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0,
        y: 100 
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 1,
        }
      }
    );

    // ClassNotes section animation
    gsap.fromTo(
      codeRef.current,
      { 
        opacity: 0,
        y: 100 
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: codeRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 1,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-[#0F172A] py-10">
      {/* TypewriteEffect Section */}
      <section 
        ref={typewriteRef} 
        className="h-[70vh] w-full flex items-center justify-center bg-[#0F172A] fixed top-0 left-0 z-30 will-change-transform pb-30"
      >
        <TypewriteEffect />
      </section>

      {/* Scrollable Content Container */}
      <div className="relative z-40">
        {/* Spacer to allow content to start below typewrite effect */}
        {/* <div className="h-[0vh]" /> */}
        
        {/* HomePageCard Section */}
        <section 
          ref={cardRef} 
          className="min-h-screen w-full flex items-center justify-center bg-[#0F172A]"
        >
          <HomePageCard />
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent " />

        {/* ClassNotes Section */}
        <section 
          ref={codeRef} 
          className="min-h-auto  w-full flex items-center justify-center bg-[#0F172A]"
        >
          <div className={`${codepro.className} text-center`}>
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 inline-block text-transparent bg-clip-text text-[2rem] sm:text-[2rem] md:text-[4rem]">
              ClassNotes and ExamPrep
            </h2>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

        {/* Courses and Testimonials */}
        <section className="relative py-20 bg-[#0F172A]">
          <TopCoursesSection courses={courses} />
          <TestimonialsSection testimonials={testimonials} />
        </section>
      </div>
    </div>
  );
};

export default Landing;
