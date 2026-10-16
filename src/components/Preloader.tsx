"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/smooth-scroll";

const VISITED_KEY = "kh:visited";

/**
 * First-visit-only branded curtain. Short (<1.2s), skippable by any pointer or
 * key press, and rendered instantly for returning visitors. Reduced-motion
 * users skip straight past it.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(VISITED_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduced) {
      setVisible(false);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(VISITED_KEY, "1");
      } catch {
        /* storage unavailable — show once per session anyway */
      }
      setVisible(false);
    };

    const timer = window.setTimeout(finish, 1000);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduced]);

  useEffect(() => {
    if (!visible) return;
    lockScroll();
    return () => unlockScroll();
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: DURATION.slow, ease: EASE.dramatic }}
          aria-hidden="true"
        >
          <div className="preloader__inner">
            <span className="preloader__mark">✦</span>
            <svg viewBox="0 0 120 8" className="preloader__line">
              <motion.line
                x1="0"
                y1="4"
                x2="120"
                y2="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: EASE.soft }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
