import { motion, useReducedMotion } from "motion/react";

export function GalleryLamp({ on }: { on: boolean }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center"
      initial={false}
      animate={{
        opacity: on ? 1 : 0.25,
        scale: on ? 1 : reduced ? 1 : 0.95,
        filter: reduced ? "blur(0px)" : on ? "blur(0px)" : "blur(6px)",
      }}
      transition={{ duration: 1.1, ease }}
    >
      {/* hanging cable */}
      <div className="h-8 w-px bg-walnut/35 md:h-12" />

      {/* ceiling fixture */}
      <div className="relative flex flex-col items-center">
        <div className="h-2 w-10 rounded-t-sm bg-olive-dark md:w-12" />
        <div
          className="h-5 w-16 border-x border-b border-gold/40 bg-olive-dark md:h-6 md:w-20"
          style={{ clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)" }}
        />
        {/* bulb */}
        <motion.div
          className="-mt-[3px] h-[6px] w-9 rounded-b-full bg-gold md:w-11"
          initial={false}
          animate={{ opacity: on ? 1 : 0.3 }}
          transition={{ duration: 1.1, ease }}
        />
        <motion.div
          className="absolute -bottom-3 h-8 w-20 rounded-full bg-gold/40 blur-lg md:w-24"
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 1.2, ease }}
        />
      </div>

      {/* light cone */}
      <motion.div
        className="light-cone w-[60vw] flex-1 origin-top md:w-[30vw]"
        initial={false}
        animate={{ opacity: on ? 0.6 : 0, scaleX: on ? 1 : 0.6 }}
        transition={{ duration: 1.4, ease }}
      />
    </motion.div>
  );
}
