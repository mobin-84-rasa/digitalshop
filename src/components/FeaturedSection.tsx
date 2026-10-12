"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
  cubicBezier,
  type MotionValue,
} from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import "@/styles/featured.css";

type CarpetStory = {
  image: string;
  titleKey: string;
  descKey: string;
};

const carpets: CarpetStory[] = [
  {
    image: "/assets/carpet-tabriz.jpg",
    titleKey: "t1",
    descKey: "d1",
  },
  {
    image: "/assets/carpet-kashan.jpg",
    titleKey: "t2",
    descKey: "d2",
  },
];

const DROP_POSITIONS = [26, 37.5, 49, 60, 71, 82.5, 94];

const softEase = cubicBezier(0.4, 0, 0.2, 1);
const verySoftEase = cubicBezier(0.25, 0.1, 0.25, 1);

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function AnimatedTitle({ text, active }: { text: string; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return <span className="inline-block">{text}</span>;
  }

  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      animate={active ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          variants={wordVariants}
          className="inline-block"
          style={{ marginLeft: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function GalleryLamp({ lightOpacity }: { lightOpacity?: MotionValue<number> }) {
  const lit = lightOpacity ? { opacity: lightOpacity } : { opacity: 1 };

  return (
    <div className="fs-lamp" aria-hidden="true">
      <motion.div className="fs-lamp__halo" style={lit} />

      <svg viewBox="0 0 120 160" className="fs-lamp__fixture">
        <path d="M60 0v48" className="fs-lamp__line" />
        <path
          d="M60 4c3 0 4.5 2 4.5 4.5S62 13 60 13s-4.5-2-4.5-4.5S57 4 60 4Z"
          className="fs-lamp__cap"
        />
        <path
          d="M60 22c3 0 4.5 2 4.5 4.5S62 31 60 31s-4.5-2-4.5-4.5S57 22 60 22Z"
          className="fs-lamp__cap"
        />
        <path d="M52 54c2-4 3-6 8-6s6 2 8 6Z" className="fs-lamp__cap" />
        <path d="M48 54h24l-3 6H51Z" className="fs-lamp__cap" />

        <motion.path
          d="M20 100a40 40 0 0 1 80 0Z"
          className="fs-lamp__dome"
          style={lit}
        />
        <motion.path
          d="M20 100a40 40 0 0 1 80 0Z"
          className="fs-lamp__dome-lit"
          style={lit}
        />

        {[-30, -15, 0, 15, 30].map((angle) => (
          <path
            key={angle}
            d="M60 60v40"
            className="fs-lamp__filigree"
            transform={`rotate(${angle} 60 100)`}
          />
        ))}

        <path d="M26 88a36 36 0 0 1 68 0" className="fs-lamp__filigree" />
        <path d="M34 74a30 30 0 0 1 52 0" className="fs-lamp__filigree" />

        {[38, 60, 82].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={i === 1 ? 76 : 87}
            r="4.2"
            className="fs-lamp__petal"
          />
        ))}

        {[48, 71].map((cx) => (
          <circle key={cx} cx={cx} cy={93} r="2.6" className="fs-lamp__petal" />
        ))}

        <path d="M18 100h84v5H18Z" className="fs-lamp__cap" />

        {DROP_POSITIONS.map((x) => (
          <g key={x}>
            <path d={`M${x} 105v4`} className="fs-lamp__line" />
            <path
              d={`M${x - 3.6} 109h7.2l-1.4 5h-4.4Z`}
              className="fs-lamp__cap"
            />
            <path
              d={`M${x - 5.6} 140c.6-11 1.6-18 5.6-26 4 8 5 15 5.6 26Z`}
              className="fs-lamp__drop"
            />
            <motion.path
              d={`M${x - 5.6} 140c.6-11 1.6-18 5.6-26 4 8 5 15 5.6 26Z`}
              className="fs-lamp__drop-lit"
              style={lit}
            />
          </g>
        ))}

        <motion.ellipse
          cx="60"
          cy="102"
          rx="34"
          ry="9"
          className="fs-lamp__light"
          style={lit}
        />
      </svg>
    </div>
  );
}

function CarpetChapter({
  carpet,
  index,
}: {
  carpet: CarpetStory;
  index: number;
}) {
  const t = useTranslations("Shop");
  const chapterRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end end"],
  });

  const textInView = useInView(textRef, { once: true, amount: 0.1 });

  const [titleActive, setTitleActive] = useState(false);

  useEffect(() => {
    if (textInView && !titleActive) {
      const timer = setTimeout(() => setTitleActive(true), 200);
      return () => clearTimeout(timer);
    }
  }, [textInView, titleActive]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > 0.05 && !titleActive) {
        setTitleActive(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, titleActive]);

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [0, -60], {
    ease: softEase,
  });

  // Ambient light: the glow is already present when a chapter arrives and then
  // turns fully on, instead of only appearing at the moment it switches on.
  const lightOn = useTransform(
    scrollYProgress,
    [0, 0.12, 0.35],
    [0.35, 0.62, 1],
    {
      ease: softEase,
    },
  );
  const lampBody = useTransform(scrollYProgress, [0, 0.94, 1], [1, 1, 0.7], {
    ease: verySoftEase,
  });
  const lampScale = useTransform(scrollYProgress, [0, 0.08, 1], [0.99, 1, 1], {
    ease: softEase,
  });

  const coneOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.35, 0.92, 1],
    [0.22, 0.55, 0.92, 0.92, 0.5],
    { ease: softEase },
  );

  const poolOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.35, 0.92, 1],
    [0.25, 0.6, 0.95, 0.95, 0.45],
    { ease: softEase },
  );
  const groundOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.35, 0.92, 1],
    [0.2, 0.55, 0.9, 0.9, 0.4],
    { ease: softEase },
  );

  const carpetOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.94, 1],
    [0.82, 1, 1, 0.5],
    {
      ease: softEase,
    },
  );
  const carpetY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.9, 1],
    [12, 0, 0, -14],
    {
      ease: softEase,
    },
  );
  const carpetScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.9, 1],
    [0.99, 1, 1, 0.992],
    {
      ease: softEase,
    },
  );

  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0.85, 1, 1, 0.7],
    {
      ease: softEase,
    },
  );
  const textY = useTransform(scrollYProgress, [0, 0.2, 1], [10, 0, -6], {
    ease: softEase,
  });

  return (
    <article
      ref={chapterRef}
      className="relative h-[145svh]"
      aria-labelledby={`carpet-${index}-title`}
    >
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden px-5 py-4 sm:px-10 sm:py-6 lg:py-7">
        <motion.div
          className="fs-cone"
          aria-hidden="true"
          style={reducedMotion ? {} : { opacity: coneOpacity, y: bgParallaxY }}
        />

        <motion.div
          className="relative z-20 h-[14svh] max-h-36 min-h-20 w-32 shrink-0 sm:w-40"
          style={reducedMotion ? {} : { opacity: lampBody, scale: lampScale }}
        >
          <GalleryLamp lightOpacity={reducedMotion ? undefined : lightOn} />
        </motion.div>

        <motion.figure
          className="relative z-10 flex h-[53svh] shrink-0 items-center justify-center"
          style={
            reducedMotion
              ? {}
              : {
                  opacity: carpetOpacity,
                  y: carpetY,
                  scale: carpetScale,
                  willChange: "transform, opacity",
                }
          }
        >
          <div className="fs-artwork">
            <motion.div
              className="fs-artwork__ground"
              aria-hidden="true"
              style={reducedMotion ? {} : { opacity: groundOpacity }}
            />
            <div className="relative h-full w-full">
              <Image
                src={carpet.image}
                alt=""
                width={1024}
                height={1408}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 84vw, min(53svh, 39rem)"
                className="h-full w-full object-contain"
              />
            </div>
            <motion.span
              className="fs-artwork__pool"
              aria-hidden="true"
              style={reducedMotion ? {} : { opacity: poolOpacity }}
            />
          </div>
        </motion.figure>

        <motion.div
          ref={textRef}
          className="relative z-20 mx-auto w-full max-w-2xl shrink-0 pt-0 pb-1 text-center sm:pt-1"
          style={reducedMotion ? {} : { opacity: textOpacity, y: textY }}
        >
          <p className="fs-muted-gold mb-2 text-sm sm:text-base lg:text-lg">
            {String(index + 1).padStart(2, "0")}
          </p>

          <h2
            id={`carpet-${index}-title`}
            className="fs-display text-3xl sm:text-4xl lg:text-7xl"
          >
            <AnimatedTitle text={t(carpet.titleKey)} active={titleActive} />
          </h2>
          <p className="fs-muted mx-auto mt-0 max-w-3xl text-[20px] leading-9 sm:text-[22px] sm:leading-10 lg:text-[30px] lg:leading-[2.2]">
            {t(carpet.descKey)}
          </p>
        </motion.div>
      </div>
    </article>
  );
}

export default function FeaturedSection() {
  const t = useTranslations("Shop");
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress: galleryProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progressScaleY = useTransform(galleryProgress, [0, 1], [0.02, 1]);

  return (
    <section ref={sectionRef} className="fs-root min-h-screen overflow-clip">
      <header className="fs-intro flex min-h-[72svh] flex-col items-center justify-center px-6 text-center">
        <h2 className="fs-display mt-5 text-4xl leading-tight sm:text-6xl lg:text-8xl">
          {t("title")}
        </h2>

        <div
          className="mt-14 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span className="fs-scroll-line" />
        </div>
      </header>

      <div aria-label={t("title")} className="relative">
        <div className="fs-rail" aria-hidden="true" />
        <motion.div
          className="fs-progress"
          aria-hidden="true"
          style={reducedMotion ? { scaleY: 1 } : { scaleY: progressScaleY }}
        />

        {carpets.map((carpet, index) => (
          <CarpetChapter key={carpet.titleKey} carpet={carpet} index={index} />
        ))}
      </div>

      <footer className="flex min-h-[55svh] items-center justify-center px-6 text-center">
        <div>
          <div className="fs-mark mx-auto" aria-hidden="true">
            ✦
          </div>

          <Link href="/shop" className="fs-cta mt-10 inline-flex text-[20px]">
            {t("all")}
          </Link>
        </div>
      </footer>
    </section>
  );
}
