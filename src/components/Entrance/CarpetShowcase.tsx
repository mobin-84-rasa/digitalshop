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
}

export default function CarpetShowcase({
  carpet,
  mode = "scroll",
}: CarpetShowcaseProps) {
  const chamberRef = useRef<HTMLElement>(null);
  const isEntry = mode === "entry";
  const isChamber = carpet.presentation === "chamber";

  useGSAP(
    () => {
      if (isEntry || !chamberRef.current) return;

      const chamber = chamberRef.current;
      const lampGlow = chamber.querySelector(".lamp-glow");
      const lampCone = chamber.querySelector(".lamp-cone");
      const surface = chamber.querySelector(".carpet-surface");
      const info = chamber.querySelector(".carpet-info");
      const veil = chamber.querySelector(".chamber-veil");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chamber,
          start: "top 72%",
          end: "top 22%",
          scrub: 0.85,
        },
        defaults: { ease: "none" },
      });

      tl.to(lampGlow, { opacity: 1, duration: 0.6 }, 0)
        .to(lampCone, { opacity: 1, scaleY: 1, duration: 1 }, 0.05)
        .to(surface, { filter: "brightness(1)", duration: 0.95 }, 0.12)
        .to(info, { opacity: 1, y: 0, duration: 0.7 }, 0.35);

      if (veil) {
        tl.to(veil, { opacity: 0.18, duration: 0.9 }, 0.08);
      }
    },
    { scope: chamberRef, dependencies: [isEntry, carpet.id] },
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
      className="gallery-wall relative flex min-h-screen w-full items-center overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-20 lg:px-12">
        <div className="relative flex w-full max-w-xl flex-col items-center">
          <GalleryLight />
          <div className="relative mt-16 h-[min(68vh,620px)] w-[min(88vw,400px)]">
            <div
              className="carpet-surface absolute inset-0"
              style={{ filter: "brightness(0.32)" }}
            >
              <Carpet carpet={carpet} />
            </div>
          </div>
        </div>
        <CarpetInfo
          carpet={carpet}
          className="w-full lg:w-[22rem] lg:shrink-0"
        />
      </div>
    </section>
  );
}
