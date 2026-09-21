"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X } from "lucide-react";

/* پالت جدید: کرم روشن + زرشکی */
const CREAM = "#F5EBDC"; /* پس‌زمینه‌ی کرم روشن */
const CREAM_SOFT = "#F5EBDC"; /* کرم کمی تیره‌تر برای حاشیه‌ها */
const BURGUNDY = "#6B1F2E"; /* زرشکی پررنگ برای متن */
const BURGUNDY_DEEP = "#4A0F1C"; /* زرشکی تیره‌تر برای هاور */

const leftNav = [
  { href: "#about", label: "درباره ما" },
  { href: "#history", label: "داستان ما" },
  { href: "#products", label: "محصولات" },
];

const rightNav = [
  { href: "#location", label: "آدرس" },
  { href: "#portfolio", label: "ارتباط با ما " },
  { href: "#contact", label: "راهنما" },
];

function MosqueMark(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 80 52"
      className="h-8 w-12 sm:h-9 sm:w-14"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke={BURGUNDY}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 6 L40 12" />
        <circle cx="40" cy="4.4" r="1.15" fill={BURGUNDY} stroke="none" />
        <path d="M24 30 C24 18 32 13 40 11 C48 13 56 18 56 30" />
        <path d="M28 30 H52 V40 H28 Z" />
        <path d="M34 40 V32.5 C34 30.2 36 29 40 29 C44 29 46 30.2 46 32.5 V40" />
        <path d="M14 22 L14 40" />
        <path d="M10 26 C10 20 14 16.5 14 16.5 C14 16.5 18 20 18 26" />
        <path d="M14 16.5 L14 13.5" />
        <circle cx="14" cy="12.4" r="1" fill={BURGUNDY} stroke="none" />
        <path d="M66 22 L66 40" />
        <path d="M62 26 C62 20 66 16.5 66 16.5 C66 16.5 70 20 70 26" />
        <path d="M66 16.5 L66 13.5" />
        <circle cx="66" cy="12.4" r="1" fill={BURGUNDY} stroke="none" />
        <path d="M10 40 H70" />
      </g>
    </svg>
  );
}

export default function Header(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      dir="rtl"
      className="relative z-40 w-full text-[#6B1F2E]"
      style={{
        background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_SOFT} 100%)`,
        fontFamily: "var(--font-Media), var(--font-cinzel), Georgia, serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
      >
        <button
          type="button"
          className="p-1 lg:hidden text-[#6B1F2E]"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {leftNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-2xl font-medium uppercase tracking-[0.28em] transition-colors"
              style={{ color: BURGUNDY }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = BURGUNDY_DEEP;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = BURGUNDY;
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#home" className="flex flex-col items-center text-center">
          <MosqueMark />
          <span
            className="mt-0.5 text-xl font-semibold leading-none tracking-[0.18em] sm:text-2xl"
            style={{ color: BURGUNDY_DEEP }}
          >
            kerman&apos;s
          </span>
          <span
            className="mt-1 text-base font-medium tracking-[0.28em] sm:text-lg"
            style={{ color: BURGUNDY }}
          >
            Carpet
          </span>
        </a>

        <div className="hidden flex-1 items-center justify-end gap-8 lg:flex">
          {rightNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-2xl font-medium uppercase tracking-[0.28em] transition-colors"
              style={{ color: BURGUNDY }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = BURGUNDY_DEEP;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = BURGUNDY;
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="ml-1 p-1 transition-colors"
            style={{ color: BURGUNDY }}
            aria-label="Search"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = BURGUNDY_DEEP;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = BURGUNDY;
            }}
          >
            <Search size={16} strokeWidth={1.6} />
          </button>
        </div>

        <button
          type="button"
          className="p-1 lg:hidden"
          style={{ color: BURGUNDY }}
          aria-label="Search"
        >
          <Search size={18} strokeWidth={1.6} />
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
            style={{
              background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_SOFT} 100%)`,
              borderTop: `1px solid rgba(107, 31, 46, 0.18)`,
              borderBottom: `1px solid rgba(107, 31, 46, 0.18)`,
            }}
          >
            <div
              className="flex flex-col gap-4 px-6 py-5 text-center text-base uppercase tracking-[0.28em]"
              style={{ color: BURGUNDY }}
            >
              {[...leftNav, ...rightNav].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="transition-colors"
                  style={{ color: BURGUNDY }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
