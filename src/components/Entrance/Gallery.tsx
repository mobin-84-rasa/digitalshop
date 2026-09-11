"use client";

import { collectionCarpets } from "@/data/carpets";
import CarpetShowcase from "./CarpetShowcase";

export default function Gallery() {
  return (
    <section className="gallery-scene relative z-10 bg-[#0c0a08]">
      <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-28 text-center">
        <div className="mb-8 h-px w-16 bg-[#f2e8d5]/25" />
        <p className="font-display text-[11px] tracking-[0.48em] text-[#d4b483]">
          THE COLLECTION
        </p>
        <p className="persian-name mt-3 text-sm text-[#f2e8d5]/50">مجموعه</p>
      </div>

      {collectionCarpets.map((carpet) => (
        <CarpetShowcase key={carpet.id} carpet={carpet} mode="scroll" />
      ))}

      <footer className="flex flex-col items-center px-6 py-32 text-center">
        <div className="h-px w-10 bg-[#65041d]" />
        <p className="font-display mt-8 text-sm tracking-[0.32em] text-[#f2e8d5]/40">
          KHANEH KERMAN
        </p>
        <p className="mt-3 max-w-xs text-[11px] leading-6 tracking-[0.18em] text-[#f2e8d5]/30">
          PRIVATE VIEWINGS BY APPOINTMENT
        </p>
      </footer>
    </section>
  );
}

export { Gallery as GalleryScene };
