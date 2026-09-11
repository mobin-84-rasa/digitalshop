"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Door from "./Door";
import Gallery from "./Gallery";
import CarpetShowcase from "./CarpetShowcase";
import { featuredCarpet } from "@/data/carpets";
import { useLenis } from "@/hooks/useLenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function EntranceScene() {
  useLenis();

  const rootRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const entrance = entranceRef.current;
      if (!entrance) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          const doorStage = entrance.querySelector(
            ".door-stage",
          ) as HTMLElement | null;
          if (!doorStage) return;

          if (reduceMotion) {
            gsap.set(".door-left", { rotationY: 90 });
            gsap.set(".door-right", { rotationY: -90 });
            gsap.set(doorStage, { opacity: 0, pointerEvents: "none" });
            gsap.set(".entry-veil, .door-vignette, .entrance-hint", {
              opacity: 0,
            });
            gsap.set(".entry-carpet-surface", { filter: "brightness(1)" });
            gsap.set(".entry-info", { opacity: 1, y: 0 });
            gsap.set(".entry-lamp .lamp-glow, .entry-lamp .lamp-cone", {
              opacity: 1,
              scaleY: 1,
            });
            gsap.set(".entry-chamber .chamber-veil", { opacity: 0.12 });
            return;
          }

          const openLeft = isDesktop ? 86 : 72;
          const openRight = isDesktop ? -86 : -72;

          const tl = gsap.timeline({
            defaults: { force3D: true },
            scrollTrigger: {
              trigger: entrance,
              start: "top top",
              end: "+=240%",
              pin: true,
              scrub: 1.35,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 20,
              onUpdate: (self) => {
                doorStage.style.pointerEvents =
                  self.progress > 0.82 ? "none" : "auto";
              },
            },
          });

          tl.to(
            ".entrance-hint",
            { opacity: 0, duration: 0.3, ease: "power1.out" },
            0,
          )
            .to(
              doorStage,
              { scale: 1.04, duration: 0.55, ease: "power1.inOut" },
              0,
            )
            .to(
              ".door-left",
              {
                rotationY: openLeft,
                xPercent: isDesktop ? -8 : -16,
                duration: 2.2,
                ease: "power2.inOut",
              },
              0.18,
            )
            .to(
              ".door-right",
              {
                rotationY: openRight,
                xPercent: isDesktop ? 8 : 16,
                duration: 2.2,
                ease: "power2.inOut",
              },
              0.18,
            )
            .to(".door-seam", { opacity: 0, duration: 0.25, ease: "none" }, 0.2)
            .to(
              ".entry-veil",
              { opacity: 0, duration: 0.9, ease: "power1.out" },
              0.35,
            )
            .to(
              ".entry-lamp .lamp-glow",
              { opacity: 1, duration: 0.7, ease: "power1.out" },
              0.85,
            )
            .to(
              ".entry-lamp .lamp-cone",
              { opacity: 0.95, scaleY: 1, duration: 1, ease: "power1.out" },
              0.9,
            )
            .to(
              ".entry-chamber .chamber-veil",
              { opacity: 0.12, duration: 0.9, ease: "power1.out" },
              0.95,
            )
            .to(
              ".entry-carpet-surface",
              { filter: "brightness(1)", duration: 1, ease: "power1.out" },
              1,
            )
            .to(
              ".entry-info",
              { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
              1.95,
            )
            .to(
              doorStage,
              {
                scale: 1.28,
                opacity: 0,
                duration: 1.05,
                ease: "power2.in",
              },
              2.15,
            )
            .to(
              ".door-vignette",
              { opacity: 0, duration: 0.65, ease: "power1.out" },
              2.2,
            )
            .to({}, { duration: 0.5 });
        },
      );

      const refresh = () => ScrollTrigger.refresh();
      const frame = requestAnimationFrame(refresh);
      const timer = window.setTimeout(refresh, 160);

      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative w-full bg-[#0c0a08]">
      <div className="gallery-grain" />

      <section
        ref={entranceRef}
        className="relative h-screen w-full overflow-x-clip overflow-y-hidden bg-[#0c0a08]"
      >
        <div className="absolute inset-0 z-0">
          <CarpetShowcase carpet={featuredCarpet} mode="entry" />
        </div>

        <div
          className="entry-veil absolute inset-0 z-10 bg-[#0c0a08]"
          style={{ opacity: 0.45 }}
        />

        <Door />

        <div className="door-vignette pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(12,10,8,0.55)_100%)]" />

        <p className="entrance-hint pointer-events-none absolute bottom-10 left-1/2 z-50 -translate-x-1/2 font-display text-[11px] tracking-[0.48em] text-[#f2e8d5]/80">
          SCROLL TO ENTER
        </p>
      </section>

      <Gallery />
    </div>
  );
}
