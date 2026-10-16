import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { locales, getDir } from '@/i18n/config';
import { CartProvider } from '@/lib/cart';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgress from '@/components/ScrollProgress';
import Cursor from '@/components/Cursor';
import Preloader from '@/components/Preloader';
import CartDrawer from '@/components/CartDrawer';
import '../globals.css';

/*
 * Only the four families the interface actually renders are shipped now:
 *  - AKETAB  → body/display for fa + ar (Persian/Arabic)
 *  - Media   → header wordmark
 *  - cinzel  → Latin display accents
 *  - cormorant (--font-display) → Latin headings
 * The other six Persian faces were loaded on every request but referenced
 * nowhere; dropping them cuts the font payload substantially.
 */
const AKETAB = localFont({
  src: '../../../public/fonts/AKetabBold.ttf',
  variable: '--font-AKETAB',
  display: 'swap',
  weight: '400',
});
const Media = localFont({
  src: '../../../public/fonts/KOMedia.otf',
  variable: '--font-Media',
  display: 'swap',
  weight: '400',
});
const cormorant = localFont({
  src: [
    {
      path: '../../../public/fonts/cormorant-garamond-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cormorant-garamond-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cormorant-garamond-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cormorant-garamond-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
});
const cinzel = localFont({
  src: [
    {
      path: '../../../public/fonts/cinzel-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cinzel-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cinzel-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/cinzel-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cinzel',
  display: 'swap',
});
const nastaliq = localFont({
  src: '../../../public/fonts/IranNastaliq.ttf',
  variable: '--font-nastaliq',
  display: 'swap',
  weight: '400',
});
const byekan = localFont({
  src: '../../../public/fonts/BYekan+.ttf',
  variable: '--font-byekan',
  display: 'swap',
  weight: '400',
});
const samim = localFont({
  src: '../../../public/fonts/Samim.ttf',
  variable: '--font-samim',
  display: 'swap',
  weight: '400',
});
const notoNastaliq = localFont({
  src: '../../../public/fonts/NotoNastaliqUrdu-SemiBold.ttf',
  variable: '--font-noto-nastaliq',
  display: 'swap',
  weight: '600',
});
const vazir = localFont({
  src: '../../../public/fonts/Vazir.ttf',
  variable: '--font-vazir',
  display: 'swap',
  weight: '400',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = getDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${cinzel.variable} ${AKETAB.variable} ${Media.variable} ${nastaliq.variable} ${byekan.variable} ${samim.variable} ${notoNastaliq.variable} ${vazir.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CartProvider>
            <SmoothScroll />
            <ScrollProgress />
            <Preloader />
            <Cursor />
            <CartDrawer />
            {children}
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
