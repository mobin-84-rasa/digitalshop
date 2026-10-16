'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getCarpets } from '@/lib/api';
import { formatPrice, toLocalizedDigits } from '@/lib/format';
import { EASE, SPRING, STAGGER } from '@/lib/motion';

import '@/styles/shop.css';

/* ============================================================
   Types & Utilities
   ============================================================ */

type Carpet = {
  id: string;
  slug: string;
  primary_image: string | null;
  images?: string[];
  title: string;
  origin: string;
  price: number | string;
  colors: string[];
  category: string;
  stock_status: 'available' | 'reserved' | 'sold';
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base } },
};

/* ============================================================
   Skeletons
   ============================================================ */

function CardSkeleton() {
  return (
    <div className="fs-card fs-card--skeleton" aria-hidden="true">
      <div className="fs-skeleton fs-skeleton--media" />
      <div className="fs-card__body">
        <div
          className="fs-skeleton fs-skeleton--line"
          style={{ width: '70%' }}
        />
        <div
          className="fs-skeleton fs-skeleton--line"
          style={{ width: '40%' }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Product Card
   ============================================================ */

function ProductCard({ carpet, locale }: { carpet: Carpet; locale: string }) {
  const reduced = useReducedMotion();
  const t = useTranslations('Common');

  const [primary, secondary] = useMemo(() => {
    const list = carpet.images?.length ? carpet.images : [];
    return [carpet.primary_image ?? list[0] ?? null, list[1] ?? null];
  }, [carpet.primary_image, carpet.images]);

  const statusLabel =
    carpet.stock_status === 'available'
      ? t('available')
      : carpet.stock_status === 'sold'
        ? t('sold')
        : t('reserved');

  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE.standard },
        },
      }}
      className="group"
    >
      <Link href={`/shop/${carpet.slug}`} className="block" data-cursor="view">
        <div className="fs-card">
          <div className="fs-card__media">
            {primary ? (
              <>
                <Image
                  src={primary}
                  alt={carpet.title}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="fs-card__img fs-card__img--primary"
                />
                {secondary && (
                  <Image
                    src={secondary}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="fs-card__img fs-card__img--secondary"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-walnut/10">
                {t('noImage')}
              </div>
            )}
            <div className="fs-card__veil" aria-hidden="true" />

            <span
              className={`fs-badge ${carpet.stock_status === 'available' ? 'fs-badge--in' : 'fs-badge--out'}`}
            >
              {statusLabel}
            </span>

            <span className="fs-card__quick" aria-hidden="true">
              <Eye size={15} />
              {t('specs')}
              <ArrowUpRight size={14} className="fs-card__quick-arrow" />
            </span>
          </div>

          <div className="fs-card__body">
            <h3 className="fs-display text-[1.3rem] sm:text-[1.45rem] lg:text-[1.6rem]">
              {carpet.title}
            </h3>
            <p className="fs-muted text-sm" style={{ marginTop: '0.15rem' }}>
              {carpet.origin}
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(carpet.colors) &&
                  carpet.colors.map((c) => (
                    <span
                      key={c}
                      className="fs-swatch"
                      style={{ background: c }}
                      aria-hidden="true"
                    />
                  ))}
              </div>

              <p className="fs-price">
                {formatPrice(carpet.price, locale)}
                <span className="fs-price__unit"> {t('currency')}</span>
              </p>
            </div>
          </div>
          <span className="fs-card__line" aria-hidden="true" />
        </div>
      </Link>
    </motion.article>
  );
}

/* ============================================================
   Shop Page
   ============================================================ */

export default function ShopPage() {
  const t = useTranslations('Shop');
  const ct = useTranslations('Common');
  const locale = useLocale();
  const reduced = useReducedMotion();

  const [carpetsData, setCarpetsData] = useState<Carpet[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setErrored(false);
      try {
        const params: Record<string, string> = {};
        if (onlyAvailable) params.stock_status = 'available';
        if (sortBy === 'price-asc') params.ordering = 'price';
        if (sortBy === 'price-desc') params.ordering = '-price';

        const data = await getCarpets(params);
        setCarpetsData(data);
      } catch {
        setErrored(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [sortBy, onlyAvailable, locale]);

  const filterKey = `${sortBy}-${onlyAvailable}`;

  return (
    <section className="fs-root min-h-screen overflow-clip">
      <header className="fs-intro flex min-h-[52svh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="fs-muted-gold text-[2.5rem]  mb-8 sm:text-[3rem]"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.standard }}
        >
          {t('title', { defaultValue: 'Gallery' })}
        </motion.p>
        <motion.h1
          className="sm:text-[3.5rem] lg:text-[4.5rem]"
          style={{ fontSize: 'clamp(2rem, 3vw, 4.5rem)' }}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE.standard }}
        >
          {t('header', { defaultValue: 'Art of Persia' })}
        </motion.h1>
      </header>

      <div className="relative">
        <div className="fs-rail" aria-hidden="true" />

        <div className="mx-auto max-w-6xl px-6 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-burgundy/10 py-6">
            <div className="flex gap-2">
              <motion.button
                type="button"
                layout
                onClick={() => setOnlyAvailable((v) => !v)}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                className={`fs-chip ${onlyAvailable ? 'is-active' : ''}`}
              >
                {t('available', { defaultValue: 'Only Available' })}
              </motion.button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="fs-select"
              aria-label={t('sort', { defaultValue: 'Sort by' })}
            >
              <option value="newest">{t('newest')}</option>
              <option value="price-asc">{t('priceAsc')}</option>
              <option value="price-desc">{t('priceDesc')}</option>
            </select>
          </div>

          {!loading && !errored && (
            <motion.p
              key={filterKey}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fs-muted mt-4 text-base sm:text-lg"
            >
              {t('found', {
                count: toLocalizedDigits(carpetsData.length, locale),
              })}
            </motion.p>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : errored ? (
            <p
              className="py-20 text-center text-lg"
              style={{ color: '#e0a0a0' }}
            >
              {ct('error')}
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filterKey}
                variants={gridVariants}
                initial={reduced ? false : 'hidden'}
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              >
                {carpetsData.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fs-muted col-span-full py-20 text-center text-lg"
                  >
                    {t('noResults')}
                  </motion.p>
                ) : (
                  carpetsData.map((carpet) => (
                    <ProductCard
                      key={carpet.id}
                      carpet={carpet}
                      locale={locale}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <footer className="flex min-h-[36svh] items-center justify-center px-6 text-center">
        <div>
          <p
            className="fs-display mt-7"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
          >
            {ct('consult')}
          </p>
          <Link href="/contact" className="fs-cta mt-19 inline-block">
            {ct('contact')}
          </Link>
        </div>
      </footer>
    </section>
  );
}
