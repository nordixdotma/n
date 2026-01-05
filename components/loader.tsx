"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [percent, setPercent] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const duration = 3000;
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const currentPercent = Math.round(easedProgress * 100);
      setPercent(currentPercent);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        timeoutId = setTimeout(() => setExit(true), 500);
      }
    };

    const rafId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (exit) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [exit, onComplete]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-9999 bg-black text-white touch-none flex flex-col justify-between p-6 md:p-10 h-svh"
        >
          {/* Logo - Top Right */}
          <div className="flex justify-end items-start w-full">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="w-20 h-auto md:w-36 object-contain"
              priority
            />
          </div>

          {/* Counter - Bottom Left */}
          <div className="w-full flex justify-start items-end">
            <div className={`${spaceGrotesk.className} text-[15vw] font-bold leading-none`}>
              <NumberFlow 
                value={percent} 
                format={{ notation: 'compact', minimumIntegerDigits: 2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
