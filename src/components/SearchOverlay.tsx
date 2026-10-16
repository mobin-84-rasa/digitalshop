"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getCarpets } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { DURATION, EASE, SPRING } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/smooth-scroll";
import "@/styles/chrome.css";

type Rug = {
  id: number | string;
  slug: string;
  title: string;
  origin: string;
  price: number | string;
  primary_image: string | null;
};

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Search");
  const ct = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Rug[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setTerm("");
      setResults([]);
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    const q = term.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const id = window.setTimeout(async () => {
      try {
        const data = await getCarpets({ search: q });
        if (!cancelled) {
          setResults(data);
          setActive(0);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [term]);

  const go = (rug: Rug) => {
    onClose();
    router.push(`/shop/${rug.slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE.standard }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
        >
          <motion.div
            className="search-palette"
            onClick={(e) => e.stopPropagation()}
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.98 }
            }
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }
            }
            transition={SPRING.snappy}
          >
            <div className="search-input-row">
              <Search size={18} aria-hidden />
              <input
                ref={inputRef}
                className="search-input"
                placeholder={t("placeholder")}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active]);
                  }
                }}
              />
              <button
                type="button"
                className="icon-btn"
                onClick={onClose}
                aria-label={ct("closeMenu")}
                style={{ color: "inherit" }}
              >
                <X size={18} />
              </button>
            </div>

            <div data-lenis-prevent className="search-results">
              {!term.trim() ? (
                <p className="search-state">{t("hint")}</p>
              ) : loading ? (
                <p className="search-state">{ct("loading")}</p>
              ) : results.length === 0 ? (
                <p className="search-state">{t("noResults")}</p>
              ) : (
                results.map((rug, i) => (
                  <button
                    key={rug.id}
                    type="button"
                    className={`search-result${i === active ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(rug)}
                    style={{ width: "100%", textAlign: "start" }}
                  >
                    <span className="search-result__media">
                      {rug.primary_image && (
                        <Image
                          src={rug.primary_image}
                          alt={rug.title}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{rug.title}</span>
                      <span className="block text-sm opacity-70">
                        {rug.origin}
                      </span>
                    </span>
                    <span className="text-sm" style={{ color: "#e8d6a3" }}>
                      {formatPrice(rug.price, locale)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
