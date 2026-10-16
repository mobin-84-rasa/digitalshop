import { cubicBezier, type Transition, type Variants } from "framer-motion";

/**
 * Shared motion system for Khaneh Kerman.
 *
 * Every animated surface (header, hero, gallery, shop, overlays, cursor)
 * reads its timing from here so the whole site moves with one voice.
 * Only `transform` and `opacity` are animated by these variants; blur is
 * reserved for small, short-lived elements (title words, specular glints).
 */

export type Bezier = [number, number, number, number];

/** Signature easings. `standard` is the default "expo-out" feel of the site. */
export const EASE: Record<
  "standard" | "emphasized" | "soft" | "inOut" | "exit" | "dramatic",
  Bezier
> = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
  soft: [0.4, 0, 0.2, 1],
  inOut: [0.65, 0, 0.35, 1],
  exit: [0.4, 0, 1, 1],
  dramatic: [0.83, 0, 0.17, 1],
};

/**
 * The same easings as callable functions. `useTransform`'s `options.ease`
 * accepts only an easing function (not a bezier tuple), so pass these there.
 */
export const EASE_FN = {
  standard: cubicBezier(...EASE.standard),
  emphasized: cubicBezier(...EASE.emphasized),
  soft: cubicBezier(...EASE.soft),
  inOut: cubicBezier(...EASE.inOut),
  exit: cubicBezier(...EASE.exit),
  dramatic: cubicBezier(...EASE.dramatic),
};

/** Durations in seconds. */
export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  base: 0.45,
  slow: 0.8,
  reveal: 1.05,
  curtain: 1.15,
} as const;

/** Stagger steps in seconds. */
export const STAGGER = {
  tight: 0.05,
  base: 0.09,
  loose: 0.14,
} as const;

/** Springs, tuned by intent rather than by physics numbers. */
export const SPRING = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.9 },
  snappy: { type: "spring", stiffness: 320, damping: 30, mass: 0.7 },
  drawer: { type: "spring", stiffness: 240, damping: 30, mass: 0.9 },
  magnetic: { type: "spring", stiffness: 260, damping: 18, mass: 0.5 },
  pop: { type: "spring", stiffness: 500, damping: 22, mass: 0.6 },
} satisfies Record<string, Transition>;

/** Ready-made tweens. */
export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE.standard },
  base: { duration: DURATION.base, ease: EASE.standard },
  slow: { duration: DURATION.slow, ease: EASE.standard },
} satisfies Record<string, Transition>;

/* ------------------------------- Variants -------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION.base },
};

/** The reduced-motion counterpart: keep opacity, drop all movement. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE.soft } },
};

/** Parent that releases children in sequence. */
export const staggerContainer = (
  stagger = STAGGER.base,
  delay = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Word/line reveal used under an overflow-hidden mask. */
export const maskedRise: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: (i: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: DURATION.reveal,
      ease: EASE.standard,
      delay: i * STAGGER.base,
    },
  }),
};

/** Press/release affordance shared by buttons and links. */
export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
} as const;
