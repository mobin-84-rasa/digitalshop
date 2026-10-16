"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  MessageCircle,
  Send,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EASE, STAGGER } from "@/lib/motion";
import "@/styles/footer.css";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.loose } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.standard },
  },
};

function FooterOrnament() {
  return (
    <svg viewBox="0 0 200 40" className="footer-ornament" aria-hidden="true">
      {/* خط طلایی با نقش تزئینی مرکزی */}
      <line
        x1="0"
        y1="20"
        x2="70"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <line
        x1="130"
        y1="20"
        x2="200"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* لوزی مرکزی */}
      <polygon
        points="100,6 112,20 100,34 88,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <polygon
        points="100,12 106,20 100,28 94,20"
        fill="currentColor"
        opacity="0.5"
      />
      {/* گل‌های کوچک کنار */}
      <circle
        cx="78"
        cy="20"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <circle
        cx="122"
        cy="20"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <circle cx="78" cy="20" r="1" fill="currentColor" />
      <circle cx="122" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter(): React.JSX.Element {
  const t = useTranslations("Common");
  const ft = useTranslations("Footer");
  const reduced = useReducedMotion();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/contact", label: t("contact") },
  ];

  const socialLinks = [
    { href: "https://instagram.com", label: "Instagram", Icon: Camera },
    { href: "https://wa.me/", label: "WhatsApp", Icon: MessageCircle },
    { href: "https://t.me/", label: "Telegram", Icon: Send },
  ];

  return (
    <footer className="site-footer">
      {/* تزئین بالای فوتر — خط طلایی */}
      <div className="site-footer__top-border" aria-hidden="true" />

      <div className="site-footer__inner">
        <motion.div
          className="site-footer__grid"
          variants={container}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* ستون برند — با پس‌زمینه تزئینی */}
          <motion.div variants={fadeUp} className="site-footer__brand">
            <div className="site-footer__brand-glow" aria-hidden="true" />
            <h3 className="site-footer__gallery-name">{ft("galleryName")}</h3>
            <p className="site-footer__tagline">{ft("tagline")}</p>
            <FooterOrnament />
          </motion.div>

          {/* ستون ناوبری */}
          <motion.div variants={fadeUp} className="site-footer__col">
            <h4 className="site-footer__heading">{ft("navigation")}</h4>
            <nav className="site-footer__nav" aria-label={ft("navigation")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="site-footer__link"
                >
                  <span className="site-footer__link-dot" aria-hidden />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* ستون تماس */}
          <motion.div variants={fadeUp} className="site-footer__col">
            <h4 className="site-footer__heading">{ft("contactUs")}</h4>
            <ul className="site-footer__contact-list">
              <li>
                <span className="site-footer__contact-icon-wrap">
                  <Phone
                    size={14}
                    className="site-footer__contact-icon"
                    aria-hidden
                  />
                </span>
                <span dir="ltr">{ft("phone")}</span>
              </li>
              <li>
                <span className="site-footer__contact-icon-wrap">
                  <Mail
                    size={14}
                    className="site-footer__contact-icon"
                    aria-hidden
                  />
                </span>
                <span>{ft("email")}</span>
              </li>
              <li>
                <span className="site-footer__contact-icon-wrap">
                  <MapPin
                    size={14}
                    className="site-footer__contact-icon"
                    aria-hidden
                  />
                </span>
                <span>{ft("address")}</span>
              </li>
            </ul>
          </motion.div>

          {/* ستون شبکه‌های اجتماعی */}
          <motion.div variants={fadeUp} className="site-footer__col">
            <h4 className="site-footer__heading">{ft("followUs")}</h4>
            <div className="site-footer__socials">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* نوار پایین */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            {ft("copyright", { year: new Date().getFullYear() })}
          </p>

          <button
            type="button"
            className="site-footer__top-btn"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
