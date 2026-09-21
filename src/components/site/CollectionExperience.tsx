import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { carpets } from "@/data/carpets";
import { CarpetScene } from "./CarpetScene";

export function CollectionExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      carpets.length - 1,
      Math.max(0, Math.floor(v * carpets.length)),
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="collection" className="bg-cream">
      {/* collection intro */}
      <div className="mx-auto max-w-[1500px] px-6 py-28 text-center md:px-12 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-heading text-4xl italic text-walnut md:text-6xl">
            مجموعه‌ای برای ماندن
          </h2>
          <div className="hairline mx-auto mt-8 w-28" />
          <p className="mx-auto mt-8 max-w-md text-sm font-light leading-9 text-walnut/70 md:text-base">
            چهار اثر، چهار روایت؛
            <br />
            از هنر دست بافنده تا نقش‌هایی که نسل‌ها را به هم پیوند می‌دهند.
          </p>
        </motion.div>
      </div>

      {/* scroll-driven carpet sequence */}
      <div
        ref={ref}
        style={{ height: `${carpets.length * 120}svh` }}
        className="relative"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {carpets.map((carpet, i) => (
            <CarpetScene
              key={carpet.id}
              carpet={carpet}
              index={i}
              active={active === i}
            />
          ))}

          {/* progress rail */}
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {carpets.map((c, i) => (
              <span
                key={c.id}
                className={`h-px transition-all duration-700 ${
                  active === i ? "w-10 bg-burgundy" : "w-4 bg-walnut/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
