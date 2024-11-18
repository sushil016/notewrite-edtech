"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MovingButton } from "./ui/moving-border";
import ThemeSwitch from "./ThemeSwitch";
import { UserDropdown } from "./ui/UserDropdown";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const gsapRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    if (gsapRef.current) {
      gsap.from(gsapRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
      });
    }
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800">
      <div
        ref={gsapRef}
        className="w-full flex justify-between items-center px-6 py-4 backdrop-blur-sm border-b border-zinc-800 shadow-lg"
      >
        <button
          onClick={() => router.push("/")}
          className="text-3xl text-blue-400 font-semibold hover:opacity-80 drop-shadow-2xl duration-200"
        >
          Robonauts
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => router.push("/services")}
            className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
          >
            Services
          </button>
          <button
            onClick={() => router.push("/courses")}
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

        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitch />

          {isLoading ? (
            <div className="animate-pulse w-8 h-8 bg-blue-400/10 rounded-full" />
          ) : isAuthenticated && user ? (
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
                <span>Login</span>
              </MovingButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-zinc-300 hover:text-blue-400 focus:outline-none"
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            className="w-6 h-6 flex flex-col justify-around"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
              className="w-full h-0.5 bg-current transform origin-center transition-transform duration-300"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              className="w-full h-0.5 bg-current"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
              className="w-full h-0.5 bg-current transform origin-center transition-transform duration-300"
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed top-[4.5rem] left-0 right-0 bg-[#0F172A]/95 backdrop-blur-md z-40"
          >
            <div className="flex flex-col items-center py-8 space-y-6">
              <button
                onClick={() => {
                  router.push("/services");
                  setIsOpen(false);
                }}
                className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
              >
                Services
              </button>
              <button
                onClick={() => {
                  router.push("/courses");
                  setIsOpen(false);
                }}
                className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
              >
                Courses
              </button>
              <button
                onClick={() => {
                  router.push("/contact");
                  setIsOpen(false);
                }}
                className="text-zinc-300 hover:text-blue-400 hover:scale-105 transform duration-150"
              >
                Contact us
              </button>
              <div className="flex flex-col items-center gap-4 pt-4 border-t border-zinc-700/50 w-full">
                <ThemeSwitch />
                {isAuthenticated && user ? (
                  <UserDropdown
                    user={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      accountType: user.accountType,
                    }}
                  />
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <MovingButton
                      borderRadius="1rem"
                      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                      <span>Login</span>
                    </MovingButton>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
