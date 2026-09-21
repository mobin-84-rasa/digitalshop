import { motion, useReducedMotion } from "motion/react";
import type { Carpet } from "@/data/carpets";
import { GalleryLamp } from "./GalleryLamp";
import { CarpetInfo } from "./CarpetInfo";

export function CarpetScene({
  carpet,
  active,
  index,
}: {
  carpet: Carpet;
  active: boolean;
  index: number;
}) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: active ? 1 : 0.15 }}
      transition={{ duration: 1.1, ease }}
      style={{ zIndex: active ? 2 : 1 }}
      aria-hidden={!active}
    >
      {/* gallery room: plaster wall + stone floor */}
      <div className="absolute inset-0 bg-cream" />
      <div className="stone-floor absolute inset-x-0 bottom-0 h-[56%]" />
      <div className="absolute inset-x-0 bottom-[56%] h-px bg-border/70" />

      <div className="relative z-[3] mx-auto flex h-full max-w-[1500px] flex-col items-center justify-end gap-8 px-6 pb-14 pt-40 md:flex-row-reverse md:items-end md:justify-between md:gap-12 md:px-12 md:pb-24 md:pt-28">
        {/* carpet on the floor */}
        <div
          className="relative w-full md:w-[42vw]"
          style={{ perspective: "1100px" }}
        >
          <div className="absolute inset-x-0 bottom-[80%] h-[30svh] md:bottom-[74%] md:h-[46svh]">
            <GalleryLamp on={active} />
          </div>
          <motion.div
            className="floor-glow absolute inset-x-[-8%] bottom-[-6%] h-[70%]"
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 1.3, ease }}
          />
          <motion.div
            className="relative will-change-transform"
            initial={false}
            animate={{
              scale: active ? 1 : reduced ? 1 : 0.96,
              filter: reduced
                ? "none"
                : active
                  ? "blur(0px) brightness(1)"
                  : "blur(3px) brightness(0.8)",
              opacity: active ? 1 : 0.45,
            }}
            transition={{ duration: 1.1, ease }}
          >
            <div
              style={{
                transform: "perspective(1200px) rotateX(44deg)",
                transformOrigin: "center bottom",
              }}
            >
              <img
                src={carpet.image}
                alt={`فرش دستباف ${carpet.name}`}
                width={1280}
                height={896}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-[30vh] w-full object-cover shadow-[0_50px_70px_-35px_rgba(42,26,20,0.6)] md:h-[34vh]"
              />
            </div>
          </motion.div>
        </div>

        <CarpetInfo carpet={carpet} active={active} />
      </div>
    </motion.div>
  );
}
