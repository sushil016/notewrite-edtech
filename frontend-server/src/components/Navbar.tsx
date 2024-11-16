"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MovingButton } from "./ui/moving-border";
import ThemeSwitch from "./ThemeSwitch";
import { UserDropdown } from "./ui/UserDropdown";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const gsapRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useGSAP(() => {
    gsap.from(gsapRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      stagger: 0.2,
    });
  });

  return (
    <div
      ref={gsapRef}
      className="text-white w-full flex justify-between items-center px-6 py-4 backdrop-blur-sm border-b-1 drop-shadow-lg shadow-lg shadow-zinc-100/10 fixed z-50"
    >
      <button
        onClick={() => router.push("/")}
        className="text-3xl text-blue-400 font-semibold hover:opacity-80 drop-shadow-2xl duration-200"
      >
        Robonauts
      </button>

      <div className="flex items-center gap-8">
        <button
          onClick={() => router.push("/services")}
          className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
        >
          Services
        </button>
        <button
          className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
        >
          Courses
        </button>
        <button
          onClick={() => router.push("/contact")}
          className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
        >
          Contact us
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitch />

        {isAuthenticated() && user ? (
          <UserDropdown
            user={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              accountType: user.accountType,
            }}
          />
        ) : (
          <Link href="/login">
            <MovingButton
              borderRadius="1rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              Login
            </MovingButton>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
