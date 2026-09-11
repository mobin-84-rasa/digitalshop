"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Carpet as CarpetData } from "@/data/carpets";
import Carpet from "./Carpet";
import CarpetInfo from "./CarpetInfo";
import GalleryLight from "./GalleryLight";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CarpetShowcaseProps {
  carpet: CarpetData;
  mode?: "entry" | "scroll";
  index?: number;
}

export default function CarpetShowcase({
  carpet,
  mode = "scroll",
  index = 0,
}: CarpetShowcaseProps) {
  const chamberRef = useRef<HTMLElement>(null);
  const isEntry = mode === "entry";
  const isChamber = carpet.presentation === "chamber";
  const fromLeft = index % 2 === 0;

  useGSAP(
    () => {
      if (isEntry || isChamber || !chamberRef.current) return;

      const chamber = chamberRef.current;
      const stage = chamber.querySelector<HTMLElement>(".showcase-stage");
      const artwork = chamber.querySelector<HTMLElement>(".showcase-artwork");
      const info = chamber.querySelector<HTMLElement>(".carpet-info");
      const infoLines = chamber.querySelectorAll<HTMLElement>(".info-line");
      const lampGlow = chamber.querySelector<HTMLElement>(".lamp-glow");
      const lampCone = chamber.querySelector<HTMLElement>(".lamp-cone");
      const carpetSpot = chamber.querySelector<HTMLElement>(".carpet-spot");
      const surface = chamber.querySelector<HTMLElement>(".carpet-surface");

      if (!stage || !info) return;

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
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(stage, { opacity: 1, xPercent: 0, scale: 1 });
            gsap.set(infoLines, { opacity: 1, y: 0 });
            gsap.set([lampGlow, carpetSpot], { opacity: 1 });
            gsap.set(lampCone, { opacity: 0.9, scaleY: 1 });
            gsap.set(surface, { filter: "brightness(1)" });
            return;
          }

          const enterX = fromLeft
            ? isDesktop
              ? -42
              : -26
            : isDesktop
              ? 42
              : 26;
          const driftX = fromLeft ? (isDesktop ? 10 : 6) : isDesktop ? -10 : -6;
          const exitX = fromLeft
            ? isDesktop
              ? 56
              : 34
            : isDesktop
              ? -56
              : -34;
          const infoParallax = fromLeft
            ? isDesktop
              ? 4
              : 2.5
            : isDesktop
              ? -4
              : -2.5;
          const artParallax = -infoParallax * 0.4;

          gsap.set(stage, {
            opacity: 0,
            xPercent: enterX,
            scale: 0.92,
            force3D: true,
          });
          gsap.set(infoLines, { opacity: 0, y: 16 });
          gsap.set(lampGlow, { opacity: 0 });
          gsap.set(carpetSpot, { opacity: 0 });
          gsap.set(lampCone, { opacity: 0, scaleY: 0.12 });
          gsap.set(surface, { filter: "brightness(0.32)" });
          gsap.set(info, { xPercent: 0 });
          gsap.set(artwork, { xPercent: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "none", force3D: true },
            scrollTrigger: {
              trigger: chamber,
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * (isDesktop ? 2.65 : 2.25))}`,
              pin: true,
              pinSpacing: true,
              scrub: 1.15,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: -1,
              fastScrollEnd: false,
              id: `collection-${carpet.id}`,
            },
          });

          tl.to(stage, { opacity: 1, xPercent: 0, scale: 1, duration: 1.55 }, 0)
            .to(lampGlow, { opacity: 1, duration: 0.75 }, 0.16)
            .to(lampCone, { opacity: 0.88, scaleY: 1, duration: 1.05 }, 0.2)
            .to(carpetSpot, { opacity: 1, duration: 0.9 }, 0.22)
            .to(surface, { filter: "brightness(1)", duration: 1 }, 0.2)
            .to(
              infoLines,
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
              0.42,
            )
            .to(stage, { xPercent: driftX, duration: 1.35 }, 1.62)
            .to(info, { xPercent: infoParallax, duration: 1.35 }, 1.62)
            .to(artwork, { xPercent: artParallax, duration: 1.35 }, 1.62)
            .to(
              stage,
              {
                xPercent: exitX,
                opacity: 0,
                scale: 0.96,
                duration: 1.25,
              },
              3.05,
            )
            .to(lampCone, { opacity: 0, scaleY: 0.16, duration: 0.7 }, 3.1)
            .to(lampGlow, { opacity: 0, duration: 0.55 }, 3.14)
            .to(carpetSpot, { opacity: 0, duration: 0.6 }, 3.12)
            .to(surface, { filter: "brightness(0.32)", duration: 0.7 }, 3.1)
            .to(infoLines, { opacity: 0, y: 8, duration: 0.5 }, 3.08);
        },
      );

      return () => mm.revert();
    },
    {
      scope: chamberRef,
      dependencies: [isEntry, isChamber, carpet.id, fromLeft],
    },
  );

  if (isChamber) {
    return (
      <section
        ref={chamberRef}
        className={`relative h-screen w-full overflow-hidden bg-[#0c0a08] ${
          isEntry ? "entry-chamber" : ""
        }`}
      >
        <div
          className={`absolute inset-0 ${isEntry ? "entry-carpet-surface" : "carpet-surface"}`}
          style={{ filter: "brightness(0.52)" }}
        >
          <Carpet carpet={carpet} />
        </div>
        <div
          className="chamber-veil absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_42%,rgba(12,10,8,0.15),rgba(12,10,8,0.72))]"
          style={{ opacity: 0.55 }}
        />
        <div className={isEntry ? "entry-lamp" : ""}>
          <GalleryLight />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-[#0c0a08]/80 via-[#0c0a08]/25 to-transparent px-6 pb-10 pt-24 md:pb-14">
          <CarpetInfo
            carpet={carpet}
            variant="chamber"
            className={isEntry ? "" : "carpet-info"}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={chamberRef}
      className="gallery-wall relative h-svh w-full max-w-[100vw] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_28%,rgba(12,10,8,0.12),rgba(12,10,8,0.72)_78%)]" />

      <div
        className={`showcase-stage relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 px-5 py-8 sm:gap-6 md:gap-10 md:px-10 md:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-14 ${
          fromLeft ? "" : "lg:flex-row-reverse"
        }`}
      >
        <div className="showcase-artwork relative flex min-w-0 w-full max-w-[min(86vw,400px)] shrink-0 flex-col items-center md:max-w-[420px]">
          <GalleryLight />
          <div className="relative mt-9 h-[min(36svh,280px)] w-[min(68vw,250px)] md:mt-14 md:h-[min(48vh,460px)] md:w-[min(42vw,320px)] lg:mt-16 lg:h-[min(62vh,580px)] lg:w-[min(40vw,380px)]">
            <div
              className="carpet-spot pointer-events-none absolute -inset-[18%] z-0 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(232,201,140,0.28),rgba(212,180,131,0.08)_42%,transparent_70%)] opacity-0"
              aria-hidden
            />
            <div
              className="carpet-surface absolute inset-0 z-[1]"
              style={{ filter: "brightness(0.32)" }}
            >
              <Carpet carpet={carpet} />
            </div>
          </div>
        </div>
        <CarpetInfo carpet={carpet} className="min-w-0 px-1" />
      </div>
    </section>
  );
}
