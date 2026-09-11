"use client";

interface GalleryLightProps {
  className?: string;
}

export default function GalleryLight({ className = "" }: GalleryLightProps) {
  return (
    <div
      className={`gallery-lamp pointer-events-none absolute left-1/2 top-0 z-20 flex w-full -translate-x-1/2 flex-col items-center ${className}`}
      aria-hidden
    >
      <div className="relative z-30 mt-1 flex flex-col items-center md:mt-2">
        <div className="h-2 w-8 rounded-full bg-[#1a120c] shadow-[0_6px_16px_rgba(0,0,0,0.5)] md:w-10" />
        <div className="h-4 w-px bg-gradient-to-b from-[#2a1c14] to-[#c4a06a] md:h-5" />
        <div className="lamp-fixture relative h-3.5 w-16 rounded-[50%] bg-gradient-to-b from-[#e2c48a] via-[#9a6e38] to-[#2c1a0c] shadow-[0_8px_24px_rgba(232,201,140,0.15)] md:h-4 md:w-20">
          <div className="lamp-glow absolute inset-x-3 top-[3px] h-2 rounded-full bg-[#f2e8d5] blur-[5px] opacity-0" />
        </div>
      </div>

      <div className="lamp-cone absolute top-[38px] h-[min(58vh,520px)] w-[min(88%,380px)] origin-top scale-y-[0.15] bg-gradient-to-b from-[rgba(232,201,140,0.46)] via-[rgba(212,180,131,0.13)] to-transparent opacity-0 md:top-[42px] md:h-[min(70vh,560px)] md:w-[min(92%,420px)]" />
    </div>
  );
}

export { GalleryLight as GalleryLamp };
