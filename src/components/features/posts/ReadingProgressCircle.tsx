"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ReadingProgressCircle() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const strokeWidth = 4;
  const radius = 32 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg 
        viewBox="0 0 64 64" 
        className="h-full w-full -rotate-90 transform"
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-base-content/10"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#00baa6"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          strokeLinecap="butt"
        />
      </svg>
    </div>
  );
}