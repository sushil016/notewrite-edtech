"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  duration = 2000,
  roundedCorners = "rounded-lg",
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  roundedCorners?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
  [key: string]: any;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pathRef.current && isMounted) {
      try {
        setPathLength(pathRef.current.getTotalLength());
      } catch (error) {
        console.warn("Path length calculation failed:", error);
      }
    }
  }, [isMounted]);

  const progress = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((time) => {
    if (!isMounted || !pathRef.current) return;
    try {
      const dt = (time / duration) % 1;
      progress.set(dt);
      const point = pathRef.current.getPointAtLength(dt * pathLength);
      x.set(point.x);
      y.set(point.y);
    } catch (error) {
      console.warn("Animation frame calculation failed:", error);
    }
  });

  const transform = useTransform(
    progress,
    [0, 1],
    ["none", "translateX(100%)"]
  );

  return (
    <Component
      className={cn(
        "relative text-center h-10 border border-slate-800 dark:border-slate-800 bg-slate-900 p-[1px] overflow-hidden",
        roundedCorners,
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className={cn(
          "relative h-full w-full bg-slate-900",
          roundedCorners,
          className
        )}
      >
        {children}
      </div>

      <motion.div
        style={{
          transform,
        }}
        className={cn(
          "absolute inset-0 border border-transparent [background:linear-gradient(var(--gradient)_,var(--gradient))_padding-box,linear-gradient(to_right,#334454,#334454)_border-box] pointer-events-none",
          roundedCorners,
          borderClassName
        )}
      />

      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <path
          ref={pathRef}
          d={`M 0 30 A 30 30 0 0 1 30 0 L ${pathLength - 30} 0 A 30 30 0 0 1 ${pathLength} 30 L ${pathLength} ${pathLength - 30} A 30 30 0 0 1 ${pathLength - 30} ${pathLength} L 30 ${pathLength} A 30 30 0 0 1 0 ${pathLength - 30} Z`}
          fill="none"
        />
      </svg>
    </Component>
  );
}

interface MovingButtonProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  [key: string]: any;
}

export function MovingButton({
  children,
  className,
  loading = false,
  ...props
}: MovingButtonProps) {
  return (
    <MovingBorder
      containerClassName={cn(
        "bg-slate-900/[0.8] border-slate-800/[0.8] dark:border-slate-600/[0.8]",
        className,
        loading && "cursor-not-allowed opacity-70"
      )}
      className="text-white relative overflow-hidden px-4 py-2 transition-colors hover:text-white/80"
      disabled={loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg 
              className="animate-spin h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </span>
    </MovingBorder>
  );
}
