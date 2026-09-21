import { motion, useReducedMotion } from "motion/react";

export function FinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section id="final" className="bg-cream">
      <div className="mx-auto max-w-[1500px] px-6 py-32 text-center md:px-12 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-light tracking-[0.3em] text-olive">
            نگارخانه نقشینه
          </span>
          <h2 className="mt-6 font-heading text-4xl italic text-walnut md:text-6xl">
            داستان کامل را ببینید
          </h2>
          <p className="mx-auto mt-7 max-w-md text-sm font-light leading-9 text-walnut/70 md:text-base">
            مجموعه‌ای از فرش‌های دستباف ایرانی،
            <br />
            برای فضاهایی که قرار است بخشی از یک داستان باشند.
          </p>

          <motion.a
            href="#collection"
            className="group mt-12 inline-flex items-center gap-3 bg-burgundy px-10 py-4 text-sm font-normal text-cream transition-colors duration-500 hover:bg-ruby"
            whileHover={{ scale: reduced ? 1 : 1.03 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            مشاهده کل مجموعه
            <motion.span
              className="inline-block text-gold"
              variants={{ rest: { x: 0, y: 0 }, hover: { x: 4, y: -4 } }}
              initial="rest"
              whileHover="hover"
            >
              ↗
            </motion.span>
          </motion.a>
        </motion.div>

        <div className="hairline mx-auto mt-24 w-40" />
        <p className="mt-8 text-[11px] font-light tracking-wide text-walnut/50">
          نقشینه — فرش دستباف کرمان
        </p>
      </div>
    </section>
  );
}
