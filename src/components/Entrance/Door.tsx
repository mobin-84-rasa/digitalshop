"use client";

import Image from "next/image";

const DOOR_SRC = "/images/door.jpeg";

export default function Door() {
  return (
    <div
      className="door-stage absolute inset-0 z-30"
      style={{ perspective: "1800px", transformStyle: "preserve-3d" }}
    >
      <div className="door-seam pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 bg-black/25" />

      <div
        className="door-left door-panel absolute inset-y-0 left-0 w-1/2 origin-left overflow-hidden bg-[#2a1a12]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-0 left-0 h-screen w-screen">
          <Image
            src={DOOR_SRC}
            alt="Ornate Persian wooden entrance"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_48%]"
          />
        </div>
        <div className="door-panel-edge" />
      </div>

      <div
        className="door-right door-panel absolute inset-y-0 right-0 w-1/2 origin-right overflow-hidden bg-[#2a1a12]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-0 right-0 h-screen w-screen">
          <Image
            src={DOOR_SRC}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_48%]"
          />
        </div>
        <div className="door-panel-edge" />
      </div>
    </div>
  );
}
