import { motion, useReducedMotion } from "motion/react";

export function ScrollIndicator() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4">
      <span className="text-[11px] font-light tracking-wide text-cream/85 md:text-xs">
        برای کشف مجموعه اسکرول کنید
      </span>
      <div className="relative h-14 w-px overflow-hidden bg-cream/25">
        {!reduced && (
          <motion.span
            className="absolute inset-x-0 top-0 block h-6 bg-gold"
            animate={{ y: ["-100%", "240%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}
