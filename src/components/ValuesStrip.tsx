"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE, STAGGER, fadeUp } from "@/lib/motion";

const svgVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE.standard },
  },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.loose } },
};

function Draw({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={svgVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      aria-hidden="true"
    >
      {children}
    </motion.svg>
  );
}

const HandmadeIcon = () => (
  <Draw className="values-strip__svg">
    <motion.path variants={pathVariants} d="M12 3v18" />
    <motion.path variants={pathVariants} d="M3 12h18" />
    <motion.path variants={pathVariants} d="M5.5 5.5l13 13" />
    <motion.path variants={pathVariants} d="M18.5 5.5l-13 13" />
    <motion.circle variants={pathVariants} cx="12" cy="12" r="4.2" />
  </Draw>
);

const AuthenticIcon = () => (
  <Draw className="values-strip__svg">
    <motion.circle variants={pathVariants} cx="12" cy="9.5" r="6" />
    <motion.path
      variants={pathVariants}
      d="M8.5 14.2L7 21l5-2.6L17 21l-1.5-6.8"
    />
    <motion.path variants={pathVariants} d="M9.6 9.6l1.7 1.7 3.1-3.6" />
  </Draw>
);

const DeliveryIcon = () => (
  <Draw className="values-strip__svg">
    <motion.path variants={pathVariants} d="M2 7h11v9H2z" />
    <motion.path variants={pathVariants} d="M13 10h4l3 3v3h-7z" />
    <motion.circle variants={pathVariants} cx="6.5" cy="18" r="1.9" />
    <motion.circle variants={pathVariants} cx="16.5" cy="18" r="1.9" />
  </Draw>
);

const ITEMS = [
  { key: "handmade", Icon: HandmadeIcon },
  { key: "authentic", Icon: AuthenticIcon },
  { key: "delivery", Icon: DeliveryIcon },
] as const;

export default function ValuesStrip() {
  const t = useTranslations("Values");
  const reduced = useReducedMotion();

  return (
    <section className="values-strip">
      <motion.div
        className="values-strip__inner"
        variants={container}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {ITEMS.map(({ key, Icon }) => (
          <motion.div
            key={key}
            variants={fadeUp}
            className="values-strip__item"
          >
            <span className="values-strip__icon">
              <Icon />
            </span>
            <h3 className="values-strip__title">{t(key)}</h3>
            <p className="values-strip__text">{t(`${key}Desc`)}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
