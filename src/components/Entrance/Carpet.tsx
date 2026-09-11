"use client";

import Image from "next/image";
import type { Carpet as CarpetData } from "@/data/carpets";

interface CarpetProps {
  carpet: CarpetData;
  className?: string;
}

export default function Carpet({ carpet, className = "" }: CarpetProps) {
  const isChamber = carpet.presentation === "chamber";

  if (isChamber) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <Image
          src={carpet.image}
          alt={carpet.name}
          fill
          priority={carpet.id === "kerman-04"}
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <Image
        src={carpet.image}
        alt={carpet.name}
        fill
        quality={85}
        sizes="(max-width: 768px) 90vw, 46vw"
        className="object-contain object-center"
      />
    </div>
  );
}
