"use client";

interface GalleryLightProps {
  isActive?: boolean;
  className?: string;
}

export default function GalleryLight({ className = "" }: GalleryLightProps) {
  return (
    <div
      className={`gallery-lamp pointer-events-none absolute left-1/2 top-0 z-20 flex w-full -translate-x-1/2 flex-col items-center ${className}`}
      aria-hidden
    >
      <div className="relative z-30 mt-2 flex flex-col items-center">
        <div className="h-2 w-10 rounded-full bg-[#1a120c] shadow-[0_6px_16px_rgba(0,0,0,0.5)]" />
        <div className="h-5 w-px bg-gradient-to-b from-[#2a1c14] to-[#c4a06a]" />
        <div className="lamp-fixture relative h-4 w-20 rounded-[50%] bg-gradient-to-b from-[#e2c48a] via-[#9a6e38] to-[#2c1a0c] shadow-[0_8px_24px_rgba(232,201,140,0.15)]">
          <div className="lamp-glow absolute inset-x-3 top-[3px] h-2 rounded-full bg-[#f2e8d5] blur-[5px] opacity-0" />
        </div>
      </div>

      <div className="lamp-cone absolute top-[42px] h-[85vh] w-[min(96vw,780px)] scale-y-[0.15] bg-gradient-to-b from-[rgba(232,201,140,0.5)] via-[rgba(212,180,131,0.16)] to-transparent opacity-0" />
    </div>
  );
}

export { GalleryLight as GalleryLamp };
