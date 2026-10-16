"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import {
  scrollToTarget,
  setLenis,
  takeScrollRestore,
} from "@/lib/smooth-scroll";

/**
 * Mounts one Lenis instance for the whole app.
 *
 * - Disabled entirely under `prefers-reduced-motion` (native scroll returns).
 * - `anchors` makes in-page `#` links glide; `stopInertiaOnNavigate` avoids
 *   inertia carrying across a route change.
 * - Scroll resets to the top on navigation, except when a restore offset is
 *   pending (language switch) so the reading position survives.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -12 },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const restore = takeScrollRestore();
    if (restore !== null) {
      // Let the new locale paint before restoring the reading position.
      const id = requestAnimationFrame(() =>
        scrollToTarget(restore, { immediate: true }),
      );
      return () => cancelAnimationFrame(id);
    }
    scrollToTarget(0, { immediate: true });
  }, [pathname, locale]);

  return null;
}
