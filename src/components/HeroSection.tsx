"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import heroRug from "../../public/images/pic1.jpg";

/* پالت جدید: کرم روشن + زرشکی */
const CREAM = "#F5EBDC";
const CREAM_SOFT = "#EFE3D0";
const BURGUNDY = "#6B1F2E";
const BURGUNDY_DEEP = "#4A0F1C";

const FRAME_PATH =
  "M 0 0.062 L 0.31 0.062 C 0.355 0.062 0.372 0.07 0.392 0.098 C 0.422 0.138 0.452 0.152 0.5 0.152 C 0.548 0.152 0.578 0.138 0.608 0.098 C 0.628 0.07 0.645 0.062 0.69 0.062 L 1 0.062 L 1 0.888 C 0.73 0.888 0.66 0.892 0.612 0.932 C 0.572 0.966 0.54 0.988 0.5 0.988 C 0.46 0.988 0.428 0.966 0.388 0.932 C 0.34 0.892 0.27 0.888 0 0.888 Z";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

function GeometricOrnament({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke={BURGUNDY} strokeWidth="1.05" opacity="0.95">
        <polygon points="100,6 164,36 194,100 164,164 100,194 36,164 6,100 36,36" />
        <polygon points="100,18 155,45 182,100 155,155 100,182 45,155 18,100 45,45" />
        <rect x="64" y="64" width="72" height="72" />
        <rect
          x="64"
          y="64"
          width="72"
          height="72"
          transform="rotate(45 100 100)"
        />
        <circle cx="100" cy="100" r="46" />
        <circle cx="100" cy="100" r="30" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4 - Math.PI / 2;
          const x = 100 + Math.cos(a) * 30;
          const y = 100 + Math.sin(a) * 30;
          return (
            <path
              key={i}
              d={`M 100 100 Q ${x + Math.cos(a + 1.2) * 12} ${y + Math.sin(a + 1.2) * 12} ${
                100 + Math.cos(a) * 46
              } ${100 + Math.sin(a) * 46} Q ${x + Math.cos(a - 1.2) * 12} ${y + Math.sin(a - 1.2) * 12} 100 100`}
            />
          );
        })}
        <circle cx="100" cy="100" r="10" />
        <circle cx="100" cy="100" r="4" fill={BURGUNDY} stroke="none" />
      </g>
    </svg>
  );
}

function Sparkle({ className }: { className?: string }): React.JSX.Element {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.12, 0.9] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M12 1.2 L13.55 10.45 L22.8 12 L13.55 13.55 L12 22.8 L10.45 13.55 L1.2 12 L10.45 10.45 Z"
        fill={BURGUNDY}
      />
    </motion.svg>
  );
}

export default function HeroSection(): React.JSX.Element {
  return (
    <section
      dir="ltr"
      className="relative isolate w-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_SOFT} 100%)`,
        color: BURGUNDY,
        fontFamily: "var(--font-AKETAB), var(--font-cinzel), Georgia, serif",
      }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="hero-frame" clipPathUnits="objectBoundingBox">
            <path d={FRAME_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="relative mx-auto min-h-[calc(120svh-7.5rem)] w-full max-w-[1440px] px-3 pb-4 sm:px-5 lg:px-7">
        <div className="relative h-full min-h-[calc(100svh-7.5rem)] w-full">
          <div
            className="absolute inset-0"
            style={{ clipPath: "url(#hero-frame)" }}
          >
            <Image
              src={heroRug}
              alt="Handmade Persian rugs and carpets"
              fill
              preload
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(74,15,28,0.45) 0%, rgba(107,31,46,0.18) 38%, rgba(74,15,28,0.55) 100%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.45 }}
              className="pointer-events-none absolute bottom-[8%] left-[2%] z-10 sm:left-[3%]"
            >
              <GeometricOrnament className="h-24 w-24 sm:h-32 sm:w-32 lg:h-[9.5rem] lg:w-[9.5rem]" />
              <GeometricOrnament className="absolute -right-9 bottom-3 h-16 w-16 opacity-85 sm:-right-12 sm:h-24 sm:w-24 lg:h-[6.5rem] lg:w-[6.5rem]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.55 }}
              className="pointer-events-none absolute right-[2%] bottom-[8%] z-10 sm:right-[3%]"
            >
              <GeometricOrnament className="h-24 w-24 sm:h-32 sm:w-32 lg:h-[9.5rem] lg:w-[9.5rem]" />
              <GeometricOrnament className="absolute -left-9 bottom-5 h-16 w-16 opacity-85 sm:-left-12 sm:h-24 sm:w-24 lg:h-[6.5rem] lg:w-[6.5rem]" />
            </motion.div>

            <span
              className="pointer-events-none absolute top-[36%] left-[3.5%] z-10 h-2.5 w-2.5 rotate-45"
              style={{
                background: CREAM,
                boxShadow: `0 0 14px ${CREAM}`,
              }}
            />
            <Sparkle className="pointer-events-none absolute bottom-[15%] left-[48%] z-10 h-4 w-4" />
            <Sparkle className="pointer-events-none absolute right-[7%] bottom-[17%] z-10 h-3.5 w-3.5" />
            <Sparkle className="pointer-events-none absolute top-[40%] right-[5%] z-10 h-3 w-3" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center sm:px-10"
            >
              <motion.h2
                variants={itemVariants}
                className="max-w-5xl text-4xl font-medium leading-[1.45] tracking-[0.02em]  sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ color: CREAM }}
              >
                تجربه اصالت
                <br />
                <span className="font-semibold tracking-[0.02em]">
                  فرش کرمان{" "}
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-4xl text-base font-light leading-relaxed tracking-wide sm:text-lg md:text-xl"
                style={{
                  fontFamily: "var(--font-KOMedia), Georgia, serif",
                  color: "rgba(245, 235, 220, 0.9)",
                }}
              >
                فرش‌های دستباف نفیس و اصیل از ایران، ترکیه، افغانستان، پاکستان،
                کشمیر و آسیای مرکزی
              </motion.p>
            </motion.div>
          </div>

          <svg
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            aria-hidden="true"
          >
            <path
              d={FRAME_PATH}
              fill="none"
              stroke={BURGUNDY}
              strokeWidth="0.0028"
            />
            <path
              d="M 0.02 0.078 L 0.318 0.078 C 0.36 0.078 0.378 0.086 0.398 0.112 C 0.426 0.148 0.454 0.162 0.5 0.162 C 0.546 0.162 0.574 0.148 0.602 0.112 C 0.622 0.086 0.64 0.078 0.682 0.078 L 0.98 0.078"
              fill="none"
              stroke={BURGUNDY}
              strokeWidth="0.0012"
              opacity="0.55"
            />
            <path
              d="M 0.02 0.878 C 0.27 0.878 0.34 0.884 0.39 0.922 C 0.43 0.954 0.46 0.974 0.5 0.974 C 0.54 0.974 0.57 0.954 0.61 0.922 C 0.66 0.884 0.73 0.878 0.98 0.878"
              fill="none"
              stroke={BURGUNDY}
              strokeWidth="0.0012"
              opacity="0.55"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
