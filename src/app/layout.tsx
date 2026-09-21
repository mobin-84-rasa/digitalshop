import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const nastaliq = localFont({
  src: '../../public/fonts/IranNastaliq.ttf',
  variable: '--font-nastaliq',
  display: 'swap',
  weight: '400',
});
const shekasteh = localFont({
  src: '../../public/fonts/Shekasteh.ttf',
  variable: '--font-shekasteh',
  display: 'swap',
  weight: '400',
});

const Regular = localFont({
  src: '../../public/fonts/Regular.ttf',
  variable: '--font-Regular',
  display: 'swap',
  weight: '400',
});
const Dima = localFont({
  src: '../../public/fonts/Dima.ttf',
  variable: '--font-Dima',
  display: 'swap',
  weight: '400',
});
const AKETAB = localFont({
  src: '../../public/fonts/AKetabBold.ttf',
  variable: '--font-AKETAB',
  display: 'swap',
  weight: '400',
});

const Media = localFont({
  src: '../../public/fonts/KOMedia.otf',
  variable: '--font-Media',
  display: 'swap',
  weight: '400',
});

const Maktab = localFont({
  src: '../../public/fonts/Maktab.ttf',
  variable: '--font-Makteb',
  display: 'swap',
  weight: '400',
});
const Muharam = localFont({
  src: '../../public/fonts/Muharam.ttf',
  variable: '--font-Dima',
  display: 'swap',
  weight: '400',
});
const Miremad = localFont({
  src: '../../public/fonts/Miremad.ttf',
  variable: '--font-miremad',
  display: 'swap',
  weight: '400',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Khaneh Kerman · Persian Carpet Art',
  description:
    'Handmade Kerman Persian carpets — heritage, collection and private viewings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nastaliq.variable} ${Media.variable} ${shekasteh.variable} ${Regular.variable} ${Dima.variable} ${Miremad.variable} ${Muharam.variable} ${cormorant.variable} ${cinzel.variable} ${AKETAB.variable} ${Maktab.variable} `}
    >
      <body>{children}</body>
    </html>
  );
}
