"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getDir } from "@/i18n/config";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { DURATION, EASE, SPRING } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/smooth-scroll";
import "@/styles/chrome.css";

export const CART_EVENT = "kh:open-cart";

/** Open the cart drawer from anywhere without a context. */
export function openCart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, subtotal, count, setQty, remove } = useCart();
  const t = useTranslations("Cart");
  const ct = useTranslations("Common");
  const locale = useLocale();
  const reduced = useReducedMotion();
  const dir = getDir(locale);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CART_EVENT, onOpen);
    return () => window.removeEventListener(CART_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const slideFrom = dir === "rtl" ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
        >
          <motion.button
            type="button"
            aria-label={ct("closeMenu")}
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
            onClick={() => setOpen(false)}
          />

          <motion.aside
            className="cart-drawer absolute top-0 bottom-0"
            style={{ insetInlineEnd: 0 }}
            initial={reduced ? { opacity: 0 } : { x: slideFrom }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: slideFrom }}
            transition={reduced ? { duration: 0.001 } : SPRING.drawer}
          >
            <header className="cart-drawer__header">
              <h2 className="fs-display flex items-center gap-2 text-xl">
                <ShoppingBag size={18} aria-hidden />
                {t("title")}
                {count > 0 && (
                  <span className="text-sm opacity-70">
                    ({formatPrice(count, locale)})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={ct("closeMenu")}
                className="rounded-full p-1 transition-transform active:scale-95"
              >
                <X size={20} />
              </button>
            </header>

            <div data-lenis-prevent className="cart-drawer__scroll">
              {items.length === 0 ? (
                <p className="py-16 text-center opacity-80">{t("empty")}</p>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reduced
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              x: slideFrom,
                              height: 0,
                              marginBottom: 0,
                            }
                      }
                      transition={SPRING.soft}
                      className="cart-line"
                    >
                      <div className="cart-line__media">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="fs-display truncate text-base"
                        >
                          {item.title}
                        </Link>
                        <span className="text-sm" style={{ color: "#e8d6a3" }}>
                          {formatPrice(item.price, locale)} {ct("currency")}
                        </span>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={t("decrease")}
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="cart-qty-btn"
                          >
                            <Minus size={13} />
                          </button>
                          <motion.span
                            key={item.qty}
                            initial={
                              reduced ? false : { scale: 1.4, opacity: 0 }
                            }
                            animate={{ scale: 1, opacity: 1 }}
                            transition={SPRING.pop}
                            className="w-6 text-center text-sm"
                          >
                            {formatPrice(item.qty, locale)}
                          </motion.span>
                          <button
                            type="button"
                            aria-label={t("increase")}
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="cart-qty-btn"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            aria-label={t("remove")}
                            onClick={() => remove(item.id)}
                            className="ms-auto text-xs underline opacity-70 transition-opacity hover:opacity-100"
                          >
                            {ct("remove")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <footer className="cart-drawer__footer">
                <div className="mb-4 flex items-center justify-between text-lg">
                  <span>{t("subtotal")}</span>
                  <span style={{ color: "#e8d6a3" }}>
                    {formatPrice(subtotal, locale)} {ct("currency")}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="cart-checkout"
                >
                  {t("checkout")}
                </Link>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
