import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, reduced ? 0 : -40]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden bg-cream"
    >
      <motion.div
        style={{ scale, y, opacity }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="/images/gallery-hero.jpg"
          alt="نگارخانه فرش دستباف ایرانی با دیوارهای کرم و کف سنگ طبیعی"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-walnut/20 to-walnut/35" />
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-6 pb-28 pt-32 md:px-12 md:pb-32"
      >
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="block text-xs font-light tracking-[0.3em] text-gold"
          >
            فرش دستباف کرمان
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 1.2,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-heading text-[2.7rem] italic leading-[1.15] text-cream sm:text-6xl md:text-7xl"
          >
            هنر ایرانی،
            <br />
            در تار و پود
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 max-w-md text-sm font-light leading-8 text-cream/80 md:text-base"
          >
            فرش‌هایی که از دل هنر، صبر و میراث ایرانی متولد می‌شوند.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#collection"
              whileHover={{ scale: reduced ? 1 : 1.03 }}
              transition={{ duration: 0.4 }}
              className="bg-burgundy px-7 py-3 text-sm font-normal text-cream transition-colors duration-500 hover:bg-ruby"
            >
              مشاهده مجموعه
            </motion.a>
            <a
              href="#collection"
              className="border-b border-cream/40 pb-1 text-sm font-light text-cream/85 transition-colors duration-500 hover:border-gold hover:text-gold"
            >
              داستان ما
            </a>
          </motion.div>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
