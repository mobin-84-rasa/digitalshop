import { motion, useReducedMotion } from "motion/react";
import type { Carpet } from "@/data/carpets";

export function CarpetInfo({
  carpet,
  active,
}: {
  carpet: Carpet;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const reveal = (delay: number) => ({
    initial: false,
    animate: {
      opacity: active ? 1 : 0,
      y: active ? 0 : reduced ? 0 : 30,
      filter: reduced ? "blur(0px)" : active ? "blur(0px)" : "blur(8px)",
    },
    transition: { duration: 1, delay: active ? delay : 0, ease },
  });

  return (
    <div className="pointer-events-none max-w-sm text-center md:text-right">
      <motion.span
        {...reveal(0.05)}
        className="block font-heading text-3xl text-gold md:text-4xl"
      >
        {carpet.number}
      </motion.span>

      <motion.h2
        {...reveal(0.15)}
        className="mt-3 font-heading text-4xl italic leading-tight text-walnut md:text-5xl"
      >
        {carpet.name}
      </motion.h2>

      <motion.p
        {...reveal(0.28)}
        className="mx-auto mt-5 max-w-xs text-sm font-light leading-8 text-walnut/70 md:mx-0 md:max-w-sm"
      >
        {carpet.description}
      </motion.p>

      <motion.div {...reveal(0.4)} className="mt-7">
        <div className="hairline w-24 md:mr-0 mx-auto md:ml-auto" />
        <ul className="mt-5 flex items-center justify-center gap-6 text-[11px] font-light tracking-wide text-olive md:justify-end md:text-xs">
          <li>{carpet.origin}</li>
          <li className="h-3 w-px bg-border" />
          <li>{carpet.technique}</li>
          <li className="h-3 w-px bg-border" />
          <li>{carpet.pattern}</li>
        </ul>
      </motion.div>
    </div>
  );
}
