"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/smooth-scroll";
import "@/styles/viewer.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Thumbnail that opens a fullscreen, pinch/drag-zoomable viewer — built for
 * inspecting knots and pile. Pan and pinch are transform-only.
 */
export default function ZoomableImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef(0);
  const pinchScale = useRef(1);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const reset = () => {
    scale.set(1);
    x.set(0);
    y.set(0);
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

  return (
    <>
      <button
        type="button"
        data-cursor="view"
        aria-label={`${t("specs")} — ${alt}`}
        className="absolute inset-0 block cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fs-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.standard }}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <button
              type="button"
              className="fs-viewer__scrim"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
            />
            <div
              className="fs-viewer__stage"
              onWheel={(e) => {
                e.preventDefault();
                scale.set(
                  clamp(scale.get() * (e.deltaY < 0 ? 1.12 : 0.9), 1, 4),
                );
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={() => (scale.get() > 1 ? reset() : scale.set(2.2))}
              style={{ touchAction: "none" }}
            >
              <motion.div className="fs-viewer__img" style={{ scale, x, y }}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="90vw"
                  priority
                  className="object-contain"
                />
              </motion.div>
            </div>

            <div className="fs-viewer__bar">
              <div className="fs-viewer__meta">
                <strong>{alt}</strong>
                <span>{t("specs")}</span>
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
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("closeMenu")}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
