"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Minus, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getDir } from "@/i18n/config";
import { getCarpets } from "@/lib/api";
import { toLocalizedDigits } from "@/lib/format";
import { EASE, EASE_FN, SPRING, STAGGER } from "@/lib/motion";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/smooth-scroll";
import "@/styles/featured.css";
import "@/styles/viewer.css";

/* ============================================================
   Types & data
   ============================================================ */

type Carpet = {
  id: string | number;
  slug: string;
  title: string;
  origin: string;
  image: string | null;
  colors: string[];
  width?: number;
  length?: number;
  stock_status?: "available" | "reserved" | "sold";
};

// Shape returned by the list endpoint (see api.serializers.CarpetListSerializer).
type ApiCarpet = {
  id: string | number;
  slug: string;
  title: string;
  origin: string;
  primary_image: string | null;
  colors?: string[];
  width?: number;
  length?: number;
  stock_status?: "available" | "reserved" | "sold";
};

// Two hand-tuned pieces so the signature section never renders empty if the
// API is unreachable — the live catalogue replaces them when it answers.
const FALLBACK: Carpet[] = [
  {
    id: "fallback-tabriz",
    slug: "tabriz-heritage",
    title: "Tabriz Heritage",
    origin: "Tabriz",
    image: "/assets/carpet-tabriz.jpg",
    colors: ["#6B1F2E", "#E8D6A3", "#2F3B18"],
    width: 200,
    length: 300,
  },
  {
    id: "fallback-kashan",
    slug: "kashan-garden",
    title: "Kashan Garden",
    origin: "Kashan",
    image: "/assets/carpet-kashan.jpg",
    colors: ["#4A0F1C", "#EFE6DD", "#636B2F"],
    width: 150,
    length: 225,
  },
];

const DROP_POSITIONS = [26, 37.5, 49, 60, 71, 82.5, 94];

const titleParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const titleWord: Variants = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE.standard } },
};

/* ============================================================
   Small building blocks
   ============================================================ */

function MaskedWords({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) return <span>{text}</span>;
  return (
    <motion.span
      className="inline"
      variants={titleParent}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-visible  align-bottom"
          style={{ paddingTop: "0.15em", paddingBottom: "0.25em" }}
        >
          <motion.span variants={titleWord} className="inline-block">
            {word}
          </motion.span>
          {"\u00A0"}
        </span>
      ))}
    </motion.span>
  );
}

function FadedLines({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion();
  const lines = useMemo(
    () =>
      text
        .split(/(?<=[.؛!?])\s+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [text],
  );
  if (reduced) return <>{text}</>;
  return (
    <motion.span
      className="block"
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.7, ease: EASE.standard },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function GalleryLamp({ light }: { light: MotionValue<number> }) {
  return (
    <div className="fs-lamp" aria-hidden="true">
      <motion.div className="fs-lamp__halo" style={{ opacity: light }} />

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
          style={{ opacity: light }}
        />
        <motion.path
          d="M20 100a40 40 0 0 1 80 0Z"
          className="fs-lamp__dome-lit"
          style={{ opacity: light }}
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

        {DROP_POSITIONS.map((x, i) => (
          <g
            key={x}
            className="fs-lamp__drop-wrap"
            style={{ animationDelay: `${i * 0.35}s` }}
          >
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
              style={{ opacity: light }}
            />
          </g>
        ))}

        <motion.ellipse
          cx="60"
          cy="102"
          rx="34"
          ry="9"
          className="fs-lamp__light"
          style={{ opacity: light }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   Chapter
   ============================================================ */

function CarpetChapter({
  carpet,
  index,
  total,
  onOpen,
  onActive,
  registerRef,
}: {
  carpet: Carpet;
  index: number;
  total: number;
  onOpen: (index: number) => void;
  onActive: (index: number) => void;
  registerRef: (index: number, el: HTMLElement | null) => void;
}) {
  const t = useTranslations("Shop");
  const ct = useTranslations("Common");
  const locale = useLocale();
  const reduced = useReducedMotion();

  const chapterRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end end"],
  });

  const textInView = useInView(textRef, { once: true, amount: 0.15 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!active && value > 0.06) setActive(true);
    if (value > 0.42 && value < 0.58) onActive(index);
  });

  useEffect(() => {
    if (textInView) setActive(true);
  }, [textInView]);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanTilt(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Scroll-linked ambient light (spring-smoothed so the lamp never snaps).
     All values start at 0 so there is absolutely no glow when the lamp is off. */
  const lightRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35],
    [0, 0.45, 1],
    { ease: EASE_FN.soft },
  );
  const light = useSpring(lightRaw, { stiffness: 90, damping: 24, mass: 0.7 });
  const coneRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35, 0.92, 1],
    [0, 0.4, 0.92, 0.92, 0.5],
    { ease: EASE_FN.soft },
  );
  const cone = useSpring(coneRaw, { stiffness: 90, damping: 24, mass: 0.7 });
  const poolRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35, 0.92, 1],
    [0, 0.45, 0.95, 0.95, 0.45],
    { ease: EASE_FN.soft },
  );
  const pool = useSpring(poolRaw, { stiffness: 90, damping: 24, mass: 0.7 });

  const lampScale = useTransform(scrollYProgress, [0, 0.08, 1], [0.98, 1, 1], {
    ease: EASE_FN.soft,
  });
  const carpetY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.9, 1],
    [16, 0, 0, -18],
    { ease: EASE_FN.soft },
  );
  const carpetOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.94, 1],
    [0.75, 1, 1, 0.5],
    { ease: EASE_FN.soft },
  );
  const carpetScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.9, 1],
    [0.97, 1, 1, 0.99],
    { ease: EASE_FN.soft },
  );
  const textY = useTransform(scrollYProgress, [0, 0.2, 1], [12, 0, -8], {
    ease: EASE_FN.soft,
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [0, -50], {
    ease: EASE_FN.soft,
  });

  // Backdrop tint derived from the carpet's dominant colour, cross-faded as the
  // piece moves through the light.
  const tintOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0],
    { ease: EASE_FN.soft },
  );
  const tint = `${carpet.colors?.[0] ?? "#2f3b18"}1f`;

  /* Mouse-driven 3D tilt + moving specular highlight (desktop only). */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-7, 7]),
    SPRING.soft,
  );
  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [6, -6]),
    SPRING.soft,
  );
  const glowX = useTransform(mx, [-0.5, 0.5], ["15%", "85%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["12%", "88%"]);
  const specular = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(255,242,214,0.4), rgba(255,242,214,0.06) 42%, transparent 62%)`;
  const [hovering, setHovering] = useState(false);

  const indexLabel = toLocalizedDigits(
    String(index + 1).padStart(2, "0"),
    locale,
  );
  const sizeLabel =
    carpet.width && carpet.length
      ? `${toLocalizedDigits(carpet.width, locale)} × ${toLocalizedDigits(carpet.length, locale)} ${ct("cm")}`
      : null;

  return (
    <article
      ref={(el) => {
        chapterRef.current = el;
        registerRef(index, el);
      }}
      className="relative h-[150svh]"
      aria-labelledby={`carpet-${index}-title`}
    >
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden px-5 py-4 sm:px-10 sm:py-6">
        <motion.div
          className="fs-tint"
          aria-hidden="true"
          style={
            reduced
              ? { opacity: 0.4 }
              : { opacity: tintOpacity, backgroundColor: tint }
          }
        />

        <motion.div
          className="fs-cone"
          aria-hidden="true"
          style={reduced ? {} : { opacity: cone, y: bgParallaxY }}
        />

        <motion.div
          className="relative z-20 h-[13svh] max-h-32 min-h-16 w-32 shrink-0 sm:w-40"
          style={reduced ? {} : { scale: lampScale }}
        >
          <GalleryLamp light={reduced ? lightRaw : light} />
        </motion.div>

        <motion.figure
          className="fs-tilt relative z-10 flex h-[42svh] shrink-0 items-center justify-center"
          style={
            reduced
              ? {}
              : {
                  y: carpetY,
                  opacity: carpetOpacity,
                  scale: carpetScale,
                  rotateX: canTilt && hovering ? rotateX : 0,
                  rotateY: canTilt && hovering ? rotateY : 0,
                  transformPerspective: 1000,
                  willChange: "transform, opacity",
                }
          }
          onPointerMove={(e) => {
            if (!canTilt) return;
            const rect = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - rect.left) / rect.width - 0.5);
            my.set((e.clientY - rect.top) / rect.height - 0.5);
          }}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => {
            setHovering(false);
            mx.set(0);
            my.set(0);
          }}
        >
          <button
            type="button"
            data-cursor="view"
            aria-label={`${ct("specs")} — ${carpet.title}`}
            onClick={() => onOpen(index)}
            className="fs-artwork block cursor-pointer"
          >
            <motion.div
              className="fs-artwork__ground"
              aria-hidden="true"
              style={reduced ? {} : { opacity: pool }}
            />
            <motion.div
              layoutId={reduced ? undefined : `carpet-${carpet.id}`}
              className="relative h-full w-full"
            >
              {carpet.image ? (
                <Image
                  src={carpet.image}
                  alt={`${carpet.title} — ${carpet.origin}`}
                  width={1024}
                  height={1408}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 84vw, min(52svh, 38rem)"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-lg opacity-60">
                  {ct("noImage")}
                </div>
              )}
              {canTilt && (
                <motion.span
                  aria-hidden="true"
                  className="fs-specular"
                  style={{
                    backgroundImage: specular,
                    opacity: hovering ? 1 : 0,
                  }}
                />
              )}
            </motion.div>
            <motion.span
              className="fs-artwork__pool"
              aria-hidden="true"
              style={reduced ? {} : { opacity: pool }}
            />
          </button>
        </motion.figure>

        <motion.div
          ref={textRef}
          className="relative z-20 mx-auto w-full  mt-7 max-w-2xl shrink-0 pb-3 text-center"
          style={reduced ? {} : { y: textY }}
        >
          <p className="fs-muted-gold mb-1 text-lg">{indexLabel}</p>

          <h2
            id={`carpet-${index}-title`}
            className="fs-display"
            style={{ fontSize: "3rem" }}
          >
            <MaskedWords text={carpet.title} active={active} />
          </h2>

          <p className="fs-meta">
            <span>{carpet.origin}</span>
            {sizeLabel && (
              <span className="fs-meta__dot" aria-hidden>
                ·
              </span>
            )}
            {sizeLabel && <span>{sizeLabel}</span>}
            <span className="fs-meta__dot" aria-hidden>
              ·
            </span>
            <span>
              {indexLabel} / {toLocalizedDigits(total, locale)}
            </span>
          </p>

          <Link href={`/shop/${carpet.slug}`} className="fs-view-cta mt-5">
            <span>{t("details")}</span>
            <ArrowUpRight
              size={16}
              className="fs-view-cta__arrow"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </article>
  );
}

/* ============================================================
   Side index
   ============================================================ */

function SideIndex({
  total,
  active,
  visible,
  onSelect,
  locale,
}: {
  total: number;
  active: number;
  visible: boolean;
  onSelect: (index: number) => void;
  locale: string;
}) {
  const reduced = useReducedMotion();
  if (total < 2) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fs-index"
          aria-label="Gallery index"
          initial={reduced ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
          transition={{ duration: 0.4, ease: EASE.standard }}
        >
          {Array.from({ length: total }).map((_, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                className={`fs-index__item${isActive ? " is-active" : ""}`}
                aria-current={isActive}
                onClick={() => onSelect(i)}
              >
                {isActive && (
                  <motion.span
                    layoutId="fs-index-pill"
                    className="fs-index__pill"
                    transition={SPRING.snappy}
                  />
                )}
                <span className="fs-index__num">
                  {toLocalizedDigits(String(i + 1).padStart(2, "0"), locale)}
                </span>
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Zoom viewer
   ============================================================ */

function ZoomViewer({
  carpet,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  locale,
}: {
  carpet: Carpet;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  locale: string;
}) {
  const ct = useTranslations("Common");
  const reduced = useReducedMotion();
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef(0);
  const pinchScale = useRef(1);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  useEffect(() => {
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrev]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    scale.set(clamp(scale.get() * (e.deltaY < 0 ? 1.12 : 0.9), 1, 4));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    if (pointers.current.size === 1) {
      x.set(x.get() + (e.clientX - prev.x));
      y.set(y.get() + (e.clientY - prev.y));
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    } else if (pointers.current.size === 2) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (!pinchStart.current) {
        pinchStart.current = dist;
        pinchScale.current = scale.get();
      } else {
        scale.set(
          clamp((pinchScale.current * dist) / pinchStart.current, 1, 4),
        );
      }
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = 0;
  };
  const reset = () => {
    scale.set(1);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="fs-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE.standard }}
      role="dialog"
      aria-modal="true"
      aria-label={carpet.title}
    >
      <button
        type="button"
        className="fs-viewer__scrim"
        aria-label={ct("closeMenu")}
        onClick={onClose}
      />

      <motion.div
        className="fs-viewer__stage"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => (scale.get() > 1 ? reset() : scale.set(2.2))}
        style={{ touchAction: "none" }}
      >
        <motion.div
          className="fs-viewer__img"
          layoutId={reduced ? undefined : `carpet-${carpet.id}`}
          style={{ scale, x: reduced ? 0 : x, y: reduced ? 0 : y }}
        >
          {carpet.image && (
            <Image
              src={carpet.image}
              alt={`${carpet.title} — ${carpet.origin}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          )}
        </motion.div>
      </motion.div>

      <div className="fs-viewer__bar" dir={getDir(locale)}>
        <div className="fs-viewer__meta">
          <strong>{carpet.title}</strong>
          <span>
            {carpet.origin} · {toLocalizedDigits(index + 1, locale)}/
            {toLocalizedDigits(total, locale)}
          </span>
        </div>
        <div className="fs-viewer__controls">
          <button
            type="button"
            onClick={() => scale.set(clamp(scale.get() - 0.4, 1, 4))}
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
          <button
            type="button"
            onClick={() => scale.set(clamp(scale.get() + 0.4, 1, 4))}
            aria-label="Zoom in"
          >
            <Plus size={18} />
          </button>
          <button type="button" onClick={reset} aria-label="Reset zoom">
            ⟲
          </button>
          <button type="button" onClick={onClose} aria-label={ct("closeMenu")}>
            <X size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Section
   ============================================================ */

export default function FeaturedSection() {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const dir = getDir(locale);
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const chaptersRef = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.2 });

  const [carpets, setCarpets] = useState<Carpet[]>(FALLBACK);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCarpets()
      .then((data: ApiCarpet[]) => {
        if (cancelled) return;
        const mapped: Carpet[] = data
          .filter((c) => c.primary_image)
          .slice(0, 4)
          .map((c) => ({
            id: c.id,
            slug: c.slug,
            title: c.title,
            origin: c.origin,
            image: c.primary_image,
            colors: c.colors ?? [],
            width: c.width,
            length: c.length,
            stock_status: c.stock_status,
          }));
        if (mapped.length >= 2) setCarpets(mapped);
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const registerRef = useCallback((index: number, el: HTMLElement | null) => {
    chaptersRef.current[index] = el;
  }, []);

  const goTo = useCallback((index: number) => {
    const el = chaptersRef.current[index];
    if (el) scrollToTarget(el, { offset: 0 });
  }, []);

  useEffect(() => {
    if (!inView || openIndex !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      const next = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const prev = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === "ArrowDown" || e.key === next) {
        e.preventDefault();
        goTo(Math.min(active + 1, carpets.length - 1));
      } else if (e.key === "ArrowUp" || e.key === prev) {
        e.preventDefault();
        goTo(Math.max(active - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, openIndex, active, carpets.length, dir, goTo]);

  return (
    <section ref={sectionRef} className="fs-root min-h-screen overflow-clip">
      <header className=" flex min-h-[72svh] flex-col items-center justify-center px-6 text-center">
        <h2
          className="fs-display mt-5 leading-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 5rem)" }}
        >
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
        {carpets.map((carpet, index) => (
          <React.Fragment key={carpet.id}>
            <CarpetChapter
              carpet={carpet}
              index={index}
              total={carpets.length}
              onOpen={setOpenIndex}
              onActive={setActive}
              registerRef={registerRef}
            />

            {index < carpets.length - 1 && (
              <div aria-hidden="true" className="h-[20svh]" />
            )}
          </React.Fragment>
        ))}

        <SideIndex
          total={carpets.length}
          active={active}
          visible={inView && openIndex === null}
          onSelect={goTo}
          locale={locale}
        />
      </div>

      <AnimatePresence>
        {openIndex !== null && carpets[openIndex] && (
          <ZoomViewer
            carpet={carpets[openIndex]}
            index={openIndex}
            total={carpets.length}
            locale={locale}
            onClose={() => setOpenIndex(null)}
            onPrev={() => setOpenIndex((i) => Math.max(0, (i ?? 0) - 1))}
            onNext={() =>
              setOpenIndex((i) => Math.min(carpets.length - 1, (i ?? 0) + 1))
            }
          />
        )}
      </AnimatePresence>

      <footer className="flex min-h-[55svh] items-center justify-center px-6 text-center">
        <div>
          <Link href="/shop" className="fs-cta mt-10">
            <span>{t("all")}</span>
            <ArrowRight className="fs-cta__arrow" size={18} aria-hidden />
          </Link>
        </div>
      </footer>
    </section>
  );
}
