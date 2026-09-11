import type { Carpet } from "@/data/carpets";

interface CarpetInfoProps {
  carpet: Carpet;
  className?: string;
  variant?: "chamber" | "hanging";
}

export default function CarpetInfo({
  carpet,
  className = "",
  variant = "hanging",
}: CarpetInfoProps) {
  const isChamber = variant === "chamber";

  return (
    <article
      className={`${isChamber ? "entry-info" : "carpet-info"} opacity-0 ${
        isChamber ? "mx-auto max-w-2xl text-center" : "max-w-md"
      } ${className}`}
      style={{ transform: "translateY(24px)" }}
    >
      <p className="font-display text-[11px] tracking-[0.42em] text-[#d4b483]">
        {carpet.number}
      </p>
      <h2
        className={`font-display mt-3 font-medium leading-tight text-[#f2e8d5] ${
          isChamber ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
        }`}
      >
        {carpet.name}
      </h2>
      <p className="persian-name mt-2 text-lg text-[#f2e8d5]/70">
        {carpet.persianName}
      </p>
      <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#636b2f]">
        {carpet.category}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#f2e8d5]/45">
        {carpet.craft}
      </p>
      <p
        className={`mt-6 text-[15px] leading-8 text-[#f2e8d5]/78 ${
          isChamber ? "mx-auto max-w-lg" : "max-w-sm"
        }`}
      >
        {carpet.story}
      </p>
      {isChamber ? (
        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#f2e8d5]/50">
          {carpet.motif} · {carpet.material} · {carpet.origin} · {carpet.age}
        </p>
      ) : (
        <dl className="museum-caption mt-8 space-y-3 text-[11px] uppercase tracking-[0.22em] text-[#f2e8d5]/55">
          <div className="flex gap-6">
            <dt className="w-20 shrink-0 text-[#d4b483]/80">Motif</dt>
            <dd className="normal-case tracking-wide text-[#f2e8d5]/80">
              {carpet.motif}
            </dd>
          </div>
          <div className="flex gap-6">
            <dt className="w-20 shrink-0 text-[#d4b483]/80">Material</dt>
            <dd className="normal-case tracking-wide text-[#f2e8d5]/80">
              {carpet.material}
            </dd>
          </div>
          <div className="flex gap-6">
            <dt className="w-20 shrink-0 text-[#d4b483]/80">Origin</dt>
            <dd className="normal-case tracking-wide text-[#f2e8d5]/80">
              {carpet.origin}
            </dd>
          </div>
          <div className="flex gap-6">
            <dt className="w-20 shrink-0 text-[#d4b483]/80">Period</dt>
            <dd className="normal-case tracking-wide text-[#f2e8d5]/80">
              {carpet.age}
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}
