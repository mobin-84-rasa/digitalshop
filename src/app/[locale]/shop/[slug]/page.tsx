'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import ZoomableImage from '@/components/ZoomableImage';
import { openCart } from '@/components/CartDrawer';
import { useCart } from '@/lib/cart';
import { useTranslations, useLocale } from 'next-intl';
import { getCarpet } from '@/lib/api';
import { formatPrice, toLocalizedDigits } from '@/lib/format';
import { EASE } from '@/lib/motion';
import '@/styles/rug.css';

/* ============================================================
   Types
   ============================================================ */

type RugDetail = {
  id: string;
  slug: string;
  images: { id: number; image: string; is_primary: boolean }[];
  title: string;
  origin: string;
  description: string;
  price: number | string;
  width: number;
  length: number;
  knot_density: string;
  material: string;
  pattern: string;
  colors: string[];
  category: { id: number; name: string };
  stock_status: 'available' | 'reserved' | 'sold';
};

type FlyState = {
  src: string;
  from: DOMRect;
  dx: number;
  dy: number;
  scale: number;
};

/* ============================================================
   Gallery
   ============================================================ */

function RugGallery({
  images,
  title,
}: {
  images: RugDetail['images'];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const t = useTranslations('Common');

  if (!images || images.length === 0)
    return (
      <div className="aspect-square bg-walnut/10 rounded-xl flex items-center justify-center">
        {t('noImage')}
      </div>
    );

  return (
    <div className="fs-gallery">
      {images.length > 1 && (
        <div className="fs-gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${title} ${i + 1}`}
              aria-current={i === activeIndex}
              className={`fs-gallery__thumb ${i === activeIndex ? 'is-active' : ''}`}
            >
              <Image
                src={img.image}
                alt={title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="fs-gallery__main" data-product-image>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE.standard }}
            className="absolute inset-0"
          >
            <ZoomableImage
              src={images[activeIndex].image}
              alt={`${title} — ${activeIndex + 1}`}
              sizes="(max-width: 1024px) 90vw, 45vw"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   Loading skeleton
   ============================================================ */

function DetailSkeleton() {
  return (
    <>
      <Header />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-12">
        <div
          className="fs-skeleton"
          style={{ aspectRatio: '4 / 5', borderRadius: '1rem' }}
        />
        <div>
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{ width: '30%' }}
          />
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{ width: '75%', height: '2.4rem' }}
          />
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{ width: '100%' }}
          />
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{ width: '90%' }}
          />
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{ width: '60%', height: '2rem', marginTop: '2rem' }}
          />
          <div
            className="fs-skeleton fs-skeleton--line"
            style={{
              width: '100%',
              height: '3rem',
              marginTop: '1.5rem',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Main Page
   ============================================================ */

export default function RugDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const locale = useLocale();
  const t = useTranslations('Common');
  const { add } = useCart();
  const reduced = useReducedMotion();

  const [rug, setRug] = useState<RugDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [added, setAdded] = useState(false);
  const flyTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchItem = async () => {
      try {
        const data = await getCarpet(slug);
        setRug(data);
      } catch {
        setErrored(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [slug, locale]);

  useEffect(
    () => () => {
      if (flyTimer.current) window.clearTimeout(flyTimer.current);
    },
    [],
  );

  if (loading) return <DetailSkeleton />;
  if (errored)
    return (
      <div className="min-h-screen bg-olive flex items-center justify-center text-cream">
        {t('error')}
      </div>
    );
  if (!rug)
    return (
      <div className="min-h-screen bg-olive flex items-center justify-center text-cream">
        {t('notFound')}
      </div>
    );

  const statusLabel =
    rug.stock_status === 'available'
      ? t('available')
      : rug.stock_status === 'sold'
        ? t('sold')
        : t('reserved');

  const handleBuy = () => {
    const image =
      rug.images && rug.images.length > 0 ? rug.images[0].image : null;
    add({
      id: Number(rug.id),
      slug: rug.slug,
      title: rug.title,
      price: Number(rug.price),
      image,
    });

    const source = document.querySelector('[data-product-image]');
    const target = document.querySelector('[data-cart-anchor]');
    if (image && source && target && !reduced) {
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      setFly({
        src: image,
        from,
        dx: to.left + to.width / 2 - (from.left + from.width / 2),
        dy: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: Math.max(0.08, to.width / Math.max(from.width, 1)),
      });
      if (flyTimer.current) window.clearTimeout(flyTimer.current);
      flyTimer.current = window.setTimeout(() => setFly(null), 850);
    }
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <section className="fs-root min-h-screen overflow-clip">
      <Header />

      <nav className="fs-breadcrumb">
        <Link href="/" className="fs-breadcrumb__link">
          {t('home')}
        </Link>
        <span>/</span>
        <Link href="/shop" className="fs-breadcrumb__link">
          {t('shop')}
        </Link>
        <span>/</span>
        <span className="fs-muted-gold">{rug.title}</span>
      </nav>

      <div className="relative">
        <div className="fs-rail" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-12">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.standard }}
          >
            <RugGallery images={rug.images} title={rug.title} />
          </motion.div>

          <motion.div
            className="fs-info lg:sticky lg:top-28 lg:self-start"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE.standard }}
          >
            <p className="fs-muted-gold text-sm sm:text-base">{rug.origin}</p>
            <h1
              className="fs-display mt-3 text-3xl leading-tight sm:text-5xl lg:text-6xl"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.75rem)' }}
            >
              {rug.title}
            </h1>
            <p className="fs-muted mt-5 text-base leading-8 sm:text-lg">
              {rug.description}
            </p>

            <div className="fs-price-box mt-7">
              <p className="fs-price-lg">
                {formatPrice(rug.price, locale)}
                <span className="fs-price__unit"> {t('currency')}</span>
              </p>
              <p className="fs-muted-gold mt-1 text-sm">{statusLabel}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <motion.button
                  type="button"
                  className="fs-cta fs-cta--block relative"
                  disabled={rug.stock_status !== 'available'}
                  onClick={handleBuy}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  data-cart-add
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? 'added' : 'buy'}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2"
                    >
                      {rug.stock_status !== 'available'
                        ? statusLabel
                        : added
                          ? `✓ ${t('buy')}`
                          : t('buy')}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
                <Link
                  href={`/contact?carpet=${rug.id}`}
                  className="fs-cta fs-cta--block bg-transparent border border-cream text-cream hover:bg-cream/10 text-center"
                >
                  {t('privateViewing')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
          <div className="fs-specs">
            <h2 className="fs-display text-2xl sm:text-3xl">{t('specs')}</h2>
            <dl className="fs-specs__grid">
              <div>
                <dt>{t('origin')}</dt>
                <dd>{rug.origin}</dd>
              </div>
              <div>
                <dt>{t('size')}</dt>
                <dd>
                  {toLocalizedDigits(rug.width, locale)} x{' '}
                  {toLocalizedDigits(rug.length, locale)} {t('cm')}
                </dd>
              </div>
              <div>
                <dt>{t('knotDensity')}</dt>
                <dd>{rug.knot_density}</dd>
              </div>
              <div>
                <dt>{t('material')}</dt>
                <dd>{rug.material}</dd>
              </div>
              <div>
                <dt>{t('pattern')}</dt>
                <dd>{rug.pattern}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Fly-to-cart ghost: transform-only, removed after it lands. */}
      <AnimatePresence>
        {fly && (
          <motion.img
            key="fly"
            src={fly.src}
            alt=""
            aria-hidden="true"
            className="pointer-events-none fixed z-[130] rounded-xl object-cover"
            style={{
              left: fly.from.left,
              top: fly.from.top,
              width: fly.from.width,
              height: fly.from.height,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: fly.dx, y: fly.dy, scale: fly.scale, opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE.standard }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
