import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LineBanner from '@/components/LineBanner';
import FeaturedSection from '@/components/FeaturedSection';
import SiteFooter from '@/components/SiteFooter';
import '@/styles/landing.css';

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5EBDC]">
      <Header />
      <HeroSection />
      <LineBanner />
      <FeaturedSection />
      <SiteFooter />
    </main>
  );
}
