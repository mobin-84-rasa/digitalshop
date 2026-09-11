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
      className={`${isChamber ? "entry-info" : "carpet-info"} ${
        isChamber
          ? "mx-auto max-w-2xl text-center opacity-0"
          : "w-full max-w-md text-center lg:text-left"
      } ${className}`}
      style={isChamber ? { transform: "translateY(24px)" } : undefined}
    >
      <p
        className={`info-kicker info-line font-display text-[11px] tracking-[0.42em] text-[#d4b483] ${
          isChamber ? "" : "hidden md:block"
        }`}
      >
        {carpet.number}
      </p>
      <h2
        className={`info-title info-line font-display mt-3 font-medium leading-tight text-[#f2e8d5] ${
          isChamber ? "text-3xl md:text-4xl" : "text-[1.75rem] md:text-5xl"
        }`}
      >
        {carpet.name}
      </h2>
      <p
        className={`info-persian info-line persian-name mt-2 text-lg text-[#f2e8d5]/70 ${
          isChamber ? "" : "hidden md:block"
        }`}
      >
        {carpet.persianName}
      </p>

      {isChamber ? (
        <>
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#636b2f]">
            {carpet.category}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#f2e8d5]/45">
            {carpet.craft}
          </p>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-8 text-[#f2e8d5]/78">
            {carpet.story}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#f2e8d5]/50">
            {carpet.motif} · {carpet.material} · {carpet.origin} · {carpet.age}
          </p>
        </>
      ) : (
        <>
          <p className="info-story info-line mt-6 hidden max-w-sm text-[15px] leading-8 text-[#f2e8d5]/75 lg:block lg:text-left">
            {carpet.story}
          </p>
          <dl className="museum-caption mx-auto mt-5 w-full max-w-sm space-y-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f2e8d5]/55 md:mt-7 md:space-y-3.5 lg:mx-0">
            <div className="info-origin info-line flex justify-center gap-5 lg:justify-start lg:gap-6">
              <dt className="w-20 shrink-0 text-[#d4b483]/80 md:w-24">
                Origin
              </dt>
              <dd className="normal-case tracking-wide text-[#f2e8d5]/85">
                {carpet.origin}
              </dd>
            </div>
            <div className="info-motif info-line flex justify-center gap-5 lg:justify-start lg:gap-6">
              <dt className="w-20 shrink-0 text-[#d4b483]/80 md:w-24">Motif</dt>
              <dd className="normal-case tracking-wide text-[#f2e8d5]/85">
                {carpet.motif}
              </dd>
            </div>
            <div className="info-material info-line flex justify-center gap-5 lg:justify-start lg:gap-6">
              <dt className="w-20 shrink-0 text-[#d4b483]/80 md:w-24">
                Material
              </dt>
              <dd className="normal-case tracking-wide text-[#f2e8d5]/85">
                {carpet.material}
              </dd>
            </div>
          </dl>
        </>
      )}
    </article>
  );
}
