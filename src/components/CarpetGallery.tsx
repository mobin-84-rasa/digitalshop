import type { MotionValue } from "motion/react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import carpetTabriz from "@/assets/carpet-tabriz.jpg";
import carpetKashan from "@/assets/carpet-kashan.jpg";
import carpetHeriz from "@/assets/carpet-heriz.jpg";
import carpetNain from "@/assets/carpet-nain.jpg";

type CarpetStory = {
  image: string;
  title: string;
  origin: string;
  description: string;
};

const carpets: CarpetStory[] = [
  {
    image: "/assets/carpet-tabriz.jpg",
    title: "هنرِ ماندگار",
    origin: "تبریز — نقش لچک و ترنج",
    description:
      "هر نقش، روایتگر بخشی از تاریخ و فرهنگ ایران است؛ فرش‌هایی که با دقت و عشق بافته شده‌اند تا سال‌ها بخشی از زندگی شما باشند.",
  },
  {
    image: "/assets/carpet-kashan.jpg",
    title: "روایتِ گلستان",
    origin: "کاشان — بافت ظریف گل‌وبوته",
    description:
      "باغی آرام در تار و پود؛ جایی که رنگ‌های پخته و گل‌های خیال‌انگیز، شکوه هنر کاشان را برای نسل‌ها حفظ می‌کنند.",
  },
  {
    image: "/assets/carpet-heriz.jpg",
    title: "شکوهِ هندسه",
    origin: "هریس — ترنج هندسی",
    description:
      "خطوط استوار و رنگ‌های خاکی، قصه کوهستان را بازمی‌گویند؛ اثری اصیل که با گذر زمان، وقار بیشتری پیدا می‌کند.",
  },
  {
    image: "/assets/carpet-nain.jpg",
    title: "آرامشِ نیلی",
    origin: "نائین — نقش افشان",
    description:
      "ظرافتی روشن بر زمینه‌ای نیلی؛ هزاران گره کوچک در کنار هم، تصویری آرام و موزون از مهارت دست‌های هنرمند ایرانی ساخته‌اند.",
  },
];
// One single fixture for every carpet: the traditional hanging dome shade
// (domed mosaic shade, long suspension rod with knop finials, ring of tulip drops).
const DROP_POSITIONS = [26, 37.5, 49, 60, 71, 82.5, 94];

function GalleryLamp({
  lightOpacity,
}: {
  lightOpacity?: MotionValue<number> | undefined;
}) {
  const lit = lightOpacity ? { opacity: lightOpacity } : {};

  return (
    <div className="gallery-lamp" aria-hidden="true">
      <motion.div className="gallery-lamp__halo" style={lit} />
      <svg viewBox="0 0 120 160" className="gallery-lamp__fixture">
        {/* suspension rod with knops */}
        <path d="M60 0v48" className="gallery-lamp__line" />
        <path
          d="M60 4c3 0 4.5 2 4.5 4.5S62 13 60 13s-4.5-2-4.5-4.5S57 4 60 4Z"
          className="gallery-lamp__cap"
        />
        <path
          d="M60 22c3 0 4.5 2 4.5 4.5S62 31 60 31s-4.5-2-4.5-4.5S57 22 60 22Z"
          className="gallery-lamp__cap"
        />

        {/* fluted crown */}
        <path d="M52 54c2-4 3-6 8-6s6 2 8 6Z" className="gallery-lamp__cap" />
        <path d="M48 54h24l-3 6H51Z" className="gallery-lamp__cap" />

        {/* domed shade */}
        <path d="M20 100a40 40 0 0 1 80 0Z" className="gallery-lamp__dome" />
        <motion.path
          d="M20 100a40 40 0 0 1 80 0Z"
          className="gallery-lamp__dome-lit"
          style={lit}
        />

        {/* mosaic ribs */}
        {[-30, -15, 0, 15, 30].map((angle) => (
          <path
            key={angle}
            d="M60 60v40"
            className="gallery-lamp__filigree"
            transform={`rotate(${angle} 60 100)`}
          />
        ))}
        <path d="M26 88a36 36 0 0 1 68 0" className="gallery-lamp__filigree" />
        <path d="M34 74a30 30 0 0 1 52 0" className="gallery-lamp__filigree" />

        {/* floral medallions in the mosaic */}
        {[38, 60, 82].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={i === 1 ? 76 : 87}
            r="4.2"
            className="gallery-lamp__petal"
          />
        ))}
        {[48, 71].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={93}
            r="2.6"
            className="gallery-lamp__petal"
          />
        ))}

        {/* rim */}
        <path d="M18 100h84v5H18Z" className="gallery-lamp__cap" />

        {/* ring of glass tulip drops */}
        {DROP_POSITIONS.map((x) => (
          <g key={x}>
            <path d={`M${x} 105v4`} className="gallery-lamp__line" />
            <path
              d={`M${x - 3.6} 109h7.2l-1.4 5h-4.4Z`}
              className="gallery-lamp__cap"
            />
            <path
              d={`M${x - 5.6} 140c.6-11 1.6-18 5.6-26 4 8 5 15 5.6 26Z`}
              className="gallery-lamp__drop"
            />
            <motion.path
              d={`M${x - 5.6} 140c.6-11 1.6-18 5.6-26 4 8 5 15 5.6 26Z`}
              className="gallery-lamp__drop-lit"
              style={lit}
            />
          </g>
        ))}

        {/* the light source itself */}
        <motion.ellipse
          cx="60"
          cy="102"
          rx="34"
          ry="9"
          className="gallery-lamp__light"
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
  const chapterRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end end"],
  });

  // 0–25% lamp switches on · 15–45% light spreads downward · 20–60% carpet is lit · 50–75% text · 85–100% out
  const lampBody = useTransform(
    scrollYProgress,
    [0, 0.06, 0.88, 1],
    [0.55, 1, 1, 0.45],
  );
  const lampScale = useTransform(scrollYProgress, [0, 0.22, 1], [0.98, 1, 1]);
  const lightOn = useTransform(
    scrollYProgress,
    [0.02, 0.1, 0.24, 0.86, 0.98],
    [0, 0.35, 1, 1, 0],
  );
  const coneOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.2, 0.42, 0.86, 0.98],
    [0, 0.4, 1, 1, 0],
  );
  const coneSpread = useTransform(scrollYProgress, [0.1, 0.46], [0.28, 1]);
  const poolOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.55, 0.86, 0.98],
    [0, 1, 1, 0],
  );

  const brightness = useTransform(scrollYProgress, [0.16, 0.58], [0.6, 1.04]);
  const saturate = useTransform(scrollYProgress, [0.16, 0.58], [0.62, 1.05]);
  const contrast = useTransform(scrollYProgress, [0.16, 0.58], [0.9, 1.03]);
  const carpetFilter = useMotionTemplate`brightness(${brightness}) saturate(${saturate}) contrast(${contrast})`;
  const carpetOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.88, 1],
    [0.9, 1, 1, 0.25],
  );
  const carpetY = useTransform(
    scrollYProgress,
    [0, 0.45, 0.85, 1],
    [26, 0, 0, -22],
  );
  const carpetScale = useTransform(
    scrollYProgress,
    [0, 0.45, 0.85, 1],
    [0.975, 1, 1, 0.985],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.68, 0.86, 0.98],
    [0, 1, 1, 0],
  );
  const textY = useTransform(scrollYProgress, [0.5, 0.7, 1], [24, 0, -12]);

  return (
    <article
      ref={chapterRef}
      className="relative h-[230svh]"
      aria-labelledby={`carpet-${index}-title`}
    >
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden px-5 py-5 sm:px-10 sm:py-7 lg:py-8">
        <motion.div
          className="gallery-cone"
          aria-hidden="true"
          style={
            reducedMotion ? {} : { opacity: coneOpacity, scaleY: coneSpread }
          }
        />

        <motion.div
          className="relative z-20 h-[17svh] min-h-24 max-h-44 w-36 shrink-0 sm:w-44"
          style={reducedMotion ? {} : { opacity: lampBody, scale: lampScale }}
        >
          <GalleryLamp lightOpacity={reducedMotion ? undefined : lightOn} />
        </motion.div>

        <motion.figure
          className="relative z-10 flex min-h-0 flex-1 items-center justify-center"
          style={
            reducedMotion
              ? {}
              : { opacity: carpetOpacity, y: carpetY, scale: carpetScale }
          }
        >
          <div className="gallery-artwork">
            <motion.img
              src={carpet.image}
              alt={`فرش دستباف ${carpet.origin}`}
              width={1024}
              height={1408}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-contain"
              style={reducedMotion ? {} : { filter: carpetFilter }}
            />
            <motion.span
              className="gallery-artwork__pool"
              aria-hidden="true"
              style={reducedMotion ? {} : { opacity: poolOpacity }}
            />
          </div>
        </motion.figure>

        <motion.div
          className="relative z-20 mx-auto w-full max-w-2xl shrink-0 pb-3 pt-3 text-center sm:pt-4"
          style={reducedMotion ? {} : { opacity: textOpacity, y: textY }}
        >
          <p className="mb-1 text-[0.65rem] text-muted-burgundy sm:text-xs">
            {String(index + 1).padStart(2, "۰")} / {carpet.origin}
          </p>
          <h2
            id={`carpet-${index}-title`}
            className="font-display text-2xl text-primary sm:text-3xl lg:text-4xl"
          >
            {carpet.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {carpet.description}
          </p>
        </motion.div>
      </div>
    </article>
  );
}

export function CarpetGallery() {
  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-clip bg-background text-foreground"
    >
      <header className="gallery-intro flex min-h-[72svh] flex-col items-center justify-center px-6 text-center">
        <div className="persian-mark" aria-hidden="true">
          ✦
        </div>
        <p className="mt-8 text-xs text-muted-burgundy">
          گنجینه‌ای از نقش و خاطره
        </p>
        <h1 className="font-display mt-5 text-4xl leading-tight text-primary sm:text-6xl lg:text-7xl">
          روایتِ تار و پود
        </h1>
        <p className="mt-6 max-w-md text-sm leading-8 text-muted-foreground sm:text-base">
          سفری آرام میان چهار اثر از هنر فرش ایران
        </p>
        <div
          className="mt-14 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span className="text-[0.65rem] text-muted-burgundy">
            برای تماشا حرکت کنید
          </span>
          <span className="gallery-scroll-line" />
        </div>
      </header>

      <section aria-label="گالری فرش‌های ایرانی" className="relative">
        <div className="gallery-rail" aria-hidden="true" />
        {carpets.map((carpet, index) => (
          <CarpetChapter key={carpet.title} carpet={carpet} index={index} />
        ))}
      </section>

      <footer className="flex min-h-[42svh] items-center justify-center px-6 text-center">
        <div>
          <div className="persian-mark mx-auto" aria-hidden="true">
            ✦
          </div>
          <p className="font-display mt-7 text-2xl text-primary sm:text-3xl">
            میراثی برای فردا
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            دست‌بافته ایران، ماندگار در خانه شما
          </p>
        </div>
      </footer>
    </main>
  );
}
