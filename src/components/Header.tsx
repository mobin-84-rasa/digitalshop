"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Globe, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { getDir } from "@/i18n/config";
import Magnetic from "@/components/Magnetic";
import { openCart } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart";
import { requestScrollRestore } from "@/lib/smooth-scroll";
import { DURATION, EASE, SPRING, STAGGER } from "@/lib/motion";
import "@/styles/chrome.css";

// The command palette is interaction-triggered and heavy, so it is loaded on
// demand rather than shipped in the first bundle.
const SearchOverlay = dynamic(() => import("@/components/SearchOverlay"), {
  ssr: false,
});

const BURGUNDY = "#6B1F2E";

const LANGUAGES = [
  { code: "ar", name: "العربية" },
  { code: "fa", name: "فارسی" },
  { code: "en", name: "English" },
] as const;

const menuList = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.base, delayChildren: 0.12 },
  },
};

const menuItem = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: DURATION.reveal, ease: EASE.standard },
  },
};

export default function Header(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [stuck, setStuck] = useState(false);
  const lastY = useRef(0);
  const reduced = useReducedMotion();

  const locale = useLocale();
  const t = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const dir = getDir(locale);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/contact", label: t("contact") },
  ];

  // Header is only visible near the top of the page. Once the user scrolls
  // past the threshold it hides and stays hidden until they return to the top.
  useEffect(() => {
    if (menuOpen || searchOpen) {
      setHidden(false);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 12);
      setHidden(y > 20);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, searchOpen]);
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setMenuOpen(false);
      return;
    }
    // Carry the reading position across the locale remount.
    requestScrollRestore(window.scrollY);
    const query = window.location.search;
    router.replace(`${pathname}${query}`, {
      locale: newLocale as "ar" | "fa" | "en",
    });
    setMenuOpen(false);
  };

  const underlineStyle = {
    color: BURGUNDY,
    ["--underline-origin" as string]: dir === "rtl" ? "right" : "left",
  } as React.CSSProperties;

  return (
    <>
      <motion.header
        className={`site-header${stuck ? " is-stuck" : ""}`}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={reduced ? { duration: 0 } : SPRING.snappy}
      >
        <div className="site-header__row">
          {/* Mobile: menu toggle */}
          <button
            type="button"
            className="icon-btn menu-toggle-btn"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={20} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-17 lg:flex text-[40px]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={underlineStyle}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Magnetic
            className="flex items-center justify-center"
            strength={0.22}
          >
            <Link href="/" aria-label={t("logoAlt")}>
              <Image
                src="/assets/toplpgo.png"
                alt={t("logoAlt")}
                width={260}
                height={116}
                priority
                className="site-logo"
              />
            </Link>
          </Magnetic>

          {/* Desktop tools */}
          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            <div
              className="flex items-center gap-9"
              style={{
                borderInlineEnd: "1px solid rgba(107,31,46,0.2)",
                paddingInlineEnd: "1.5rem",
              }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className="relative  text-[26px]  font-semibold"
                  style={{ color: locale === lang.code ? BURGUNDY : BURGUNDY }}
                >
                  {locale === lang.code && (
                    <motion.span
                      layoutId="lang-pill"
                      className="absolute -inset-x-2 -inset-y-1 -z-10 rounded-full"
                      style={{ background: "rgba(107,31,46,0.12)" }}
                      transition={SPRING.snappy}
                    />
                  )}
                  <span
                    className={
                      locale === lang.code ? "opacity-100" : "opacity-60"
                    }
                  >
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>

            <Magnetic strength={0.35}>
              <button
                type="button"
                className="icon-btn"
                style={{ color: BURGUNDY }}
                aria-label={t("search")}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={18} strokeWidth={1.6} />
              </button>
            </Magnetic>

            <Magnetic strength={0.35}>
              <button
                type="button"
                className="icon-btn relative"
                style={{ color: BURGUNDY }}
                aria-label={t("cart")}
                data-cart-anchor
                onClick={openCart}
              >
                <ShoppingBag size={18} strokeWidth={1.6} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      className="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={SPRING.pop}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Magnetic>
          </div>

          {/* Mobile tools */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              className="icon-btn"
              style={{ color: BURGUNDY }}
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              className="icon-btn relative"
              style={{ color: BURGUNDY }}
              aria-label={t("cart")}
              data-cart-anchor
              onClick={openCart}
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
          >
            <div className="mobile-menu__top">
              <Image
                src="/assets/toplpgo.png"
                alt={t("logoAlt")}
                width={260}
                height={146}
                priority
                className="site-logo"
              />
              <button
                type="button"
                className="icon-btn"
                style={{ color: "inherit" }}
                aria-label={t("closeMenu")}
                onClick={() => setMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <motion.nav
              className="mobile-menu__links"
              variants={menuList}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item) => (
                <span key={item.href} className="overflow-hidden py-1">
                  <motion.span variants={menuItem} className="block">
                    <Link
                      href={item.href}
                      className="mobile-menu__link"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
            </motion.nav>

            <div className="mobile-menu__langs">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className="text-sm font-semibold"
                  style={{
                    color: "inherit",
                    opacity: locale === lang.code ? 1 : 0.55,
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
