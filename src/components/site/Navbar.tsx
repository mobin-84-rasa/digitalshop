import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const links = ["مجموعه فرش‌ها", "داستان ما", "هنر و بافت", "نگارخانه", "تماس"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        solid ? "bg-cream/75 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#"
          className="font-heading text-2xl tracking-tight text-walnut md:text-3xl"
        >
          نقشینه
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#collection"
              className="relative text-sm font-light text-walnut/80 transition-colors duration-300 hover:text-burgundy"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#final"
            className="hidden rounded-none border border-burgundy px-5 py-2 text-xs font-medium tracking-wide text-burgundy transition-colors duration-500 hover:bg-burgundy hover:text-cream md:inline-block"
          >
            مشاهده مجموعه
          </a>
          <button
            aria-label="منو"
            onClick={() => setOpen((v) => !v)}
            className="text-walnut lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="hairline mx-6 md:mx-12" />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-cream/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-8">
              {links.map((l) => (
                <a
                  key={l}
                  href="#collection"
                  onClick={() => setOpen(false)}
                  className="text-base font-light text-walnut/85"
                >
                  {l}
                </a>
              ))}
              <a
                href="#final"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block w-fit border border-burgundy px-5 py-2 text-xs text-burgundy"
              >
                مشاهده مجموعه
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
