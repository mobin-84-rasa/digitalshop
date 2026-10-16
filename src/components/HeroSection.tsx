"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Magnetic from "@/components/Magnetic";
import { DURATION, EASE } from "@/lib/motion";

const heroRug = "/images/pic1.jpg";

const CREAM = "#F5EBDC";
const CREAM_SOFT = "#EFE3D0";
const BURGUNDY = "#6B1F2E";

const FRAME_PATH =
  "M 0 0.062 L 0.31 0.062 C 0.355 0.062 0.372 0.07 0.392 0.098 C 0.422 0.138 0.452 0.152 0.5 0.152 C 0.548 0.152 0.578 0.138 0.608 0.098 C 0.628 0.07 0.645 0.062 0.69 0.062 L 1 0.062 L 1 0.888 C 0.73 0.888 0.66 0.892 0.612 0.932 C 0.572 0.966 0.54 0.988 0.5 0.988 C 0.46 0.988 0.428 0.966 0.388 0.932 C 0.34 0.892 0.27 0.888 0 0.888 Z";

/** Title words rise out from behind a mask, one after another. */
const wordParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};

const wordChild: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: DURATION.reveal, ease: EASE.standard },
  },
};

function SplitHeading({ text }: { text: string }) {
  return (
    <span className="inline">
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block align-bottom"
          style={{ paddingBottom: "0.08em" }}
        >
          <motion.span variants={wordChild} className="inline-block">
            {word}
          </motion.span>
          {"\u00A0"}
        </span>
      ))}
    </span>
  );
}

function GeometricOrnament({ className }: { className?: string }) {
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

export default function HeroSection(): React.JSX.Element {
  const t = useTranslations("Common");
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imgY = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.6 });
  const imgScale = useSpring(rawScale, {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
  });
  const rotate = useSpring(rawRotate, { stiffness: 60, damping: 20 });

  const set = <T,>(value: T) => (reduced ? undefined : value);

  return (
    <section
      ref={ref}
      className="relative isolate w-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_SOFT} 100%)`,
        color: BURGUNDY,
        fontFamily:
          "var(--font-noto-nastaliq), var(--font-AKETAB), Georgia, serif",
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
            className="hero-media absolute inset-0"
            style={{ clipPath: "url(#hero-frame)" }}
          >
            {/* The image is revealed by a curtain that drops downwards. */}
            <motion.div
              className="absolute inset-0"
              initial={
                reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }
              }
              animate={
                reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
              }
              transition={{ duration: 1.15, ease: EASE.dramatic }}
            >
              <motion.div
                className="absolute inset-0"
                style={set({ y: imgY, scale: imgScale })}
              >
                <Image
                  src={heroRug}
                  alt={t("title")}
                  fill
                  priority
                  sizes="100vw"
                  quality={90}
                  className="hero-media__img object-cover object-center"
                />
              </motion.div>

              {/* Legibility scrim: darker behind the text block. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(74,15,28,0.5) 0%, rgba(107,31,46,0.16) 34%, rgba(74,15,28,0.35) 58%, rgba(30,7,13,0.78) 100%)",
                }}
              />

              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.7, ease: EASE.standard }}
                className="pointer-events-none absolute bottom-[8%] left-[2%] z-10 sm:left-[3%]"
              >
                <motion.div style={set({ rotate })}>
                  <GeometricOrnament className="h-24 w-24 sm:h-32 sm:w-32 lg:h-[9.5rem] lg:w-[9.5rem]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center sm:px-10">
            <motion.h2
              variants={wordParent}
              initial="hidden"
              animate="visible"
              className="pointer-events-auto mb-8 max-w-5xl font-medium leading-[1.35] tracking-[0.02em]"

              style={{ color: CREAM, fontSize: "clamp(3rem, 5vw, 5.5rem)" }}
            >
              {reduced ? t("title") : <SplitHeading text={t("title")} />}
            </motion.h2>

            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: EASE.standard }}
              className="mt-6 max-w-4xl font-light leading-relaxed tracking-wide"
              style={{
                color: "rgba(245, 235, 220, 0.95)",
                textShadow: "0 2px 18px rgba(30,7,13,0.6)",
                fontSize: "clamp(1.15rem, 1.5vw, 1.5rem)",
                fontFamily: "var(--font-vazir)",
              }}
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: EASE.standard }}
              className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <Magnetic strength={0.25}>
                <Link href="/shop" className="hero-cta hero-cta--solid">
                  <span>{t("shop")}</span>
                  <ArrowRight
                    className="hero-cta__arrow"
                    size={18}
                    aria-hidden
                  />
                </Link>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link href="/contact" className="hero-cta hero-cta--ghost">
                  <span>{t("contact")}</span>
                  <ArrowRight
                    className="hero-cta__arrow"
                    size={18}
                    aria-hidden
                  />
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="hero-scroll"
            aria-hidden="true"
          >
            <span className="hero-scroll__mouse">
              <span className="hero-scroll__dot" />
            </span>
            <span className="hero-scroll__line" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
