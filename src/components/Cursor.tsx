"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SPRING } from "@/lib/motion";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * Desktop-only cursor: a burgundy dot that tracks the pointer exactly and a
 * ring that trails it on a spring. The ring grows over interactive elements
 * and shows "View" over carpets. Hidden on touch devices and whenever the
 * user prefers reduced motion.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [view, setView] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, SPRING.magnetic);
  const ringY = useSpring(dotY, SPRING.magnetic);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(query.matches && !reduced.matches);
    sync();
    query.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      const target = event.target as HTMLElement | null;
      const interactive = !!target?.closest?.(INTERACTIVE);
      setActive(interactive);
      setView(!!target?.closest?.('[data-cursor="view"]'));
    };
    const onLeave = () => {
      dotX.set(-100);
      dotY.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        aria-hidden="true"
        className={`cursor-ring${view ? " is-view" : active ? " is-active" : ""}`}
        style={{ x: ringX, y: ringY }}
      >
        {view ? "View" : null}
      </motion.div>
    </>
  );
}
