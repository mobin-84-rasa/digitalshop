import type Lenis from "lenis";

/**
 * Tiny module-level bridge to the single Lenis instance so overlays, the
 * language switcher and anchor CTAs can drive scroll without prop-drilling
 * or React context (the instance lives across client-side navigations).
 */

let instance: Lenis | null = null;
let locks = 0;
let pendingRestore: number | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Freeze page scroll (menus, drawers, the search palette). Counter-based. */
export function lockScroll() {
  locks += 1;
  if (locks !== 1) return;
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks !== 0) return;
  instance?.start();
  document.documentElement.style.overflow = "";
}

/** Jump to an element (or the top) through Lenis when it exists. */
export function scrollToTarget(
  target: number | string | HTMLElement,
  options: { immediate?: boolean; offset?: number } = {},
) {
  const { immediate = false, offset = 0 } = options;
  if (instance) {
    instance.scrollTo(target, { immediate, offset });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({
      top: target + offset,
      behavior: immediate ? "auto" : "smooth",
    });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}

/**
 * Ask the next mount to restore a scroll offset instead of jumping to top.
 * Used by the language switcher, which remounts the locale layout.
 */
export function requestScrollRestore(y: number | null) {
  pendingRestore = y;
}

export function takeScrollRestore(): number | null {
  const value = pendingRestore;
  pendingRestore = null;
  return value;
}
